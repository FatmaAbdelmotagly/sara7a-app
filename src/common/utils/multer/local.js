import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, rename, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { BadException } from "../../exceptions/error.exceptions.js";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  files: ["application/pdf", "application/json"],
};

export const localFileUpload = ({ maxFileSize = 5, validation = [] } = {}) => {
  // const storage = multer.diskStorage({
  //     destination: function(req , file , cb){
  //         cb(null , './assets')
  //     },
  //     filename: function(req , file , cb){
  //         console.log({file});

  //         cb(null ,randomUUID() + file.originalname)
  //     }
  // })

  const storage = multer.memoryStorage();
  // const fileFilter = (req, file , cb)=>{
  //     if(validation.includes(file.mimetype)){
  //         cb(null , true)
  //     }else {
  //         cb(new Error("invalid format" , {cause : {status : 400}}) , false )
  //     }
  // }

  return multer({
    storage,
    limits: {
      fileSize: maxFileSize * 1024 * 1024,
    },
  });
};

export const processFile = async ({
  customPath = "general",
  file,
  validation = [],
}) => {
  const result = await fileTypeFromBuffer(file.buffer);
  console.log("Original Name:", file.originalname);
  console.log("Multer Mime:", file.mimetype);
  console.log("Detected Type:", result);
  if (!result || !validation.includes(result.mime)) {
    throw BadException("invalid file format");
  }

  const tempPath = `temp/${customPath}/${randomUUID()}.${result.ext}`;
  file.path = tempPath;

  try {
    await mkdir(resolve(`./temp/${customPath}`), {
      recursive: true,
    });

    await writeFile(resolve(`./${tempPath}`), file.buffer);

    return file;
  } catch (error) {
    await rm(resolve(`./${tempPath}`), {
      force: true,
    });

    throw error;
  }
};

export const rollbackFiles = async (files = []) => {
  for (const file of files) {
    if (file.path) {
      await rm(resolve(`./${file.path}`), {
        force: true,
      });
    }
  }
};

export const commitFiles = async (files = []) => {
  const committedFiles = [];

  try {
    for (const file of files) {
      const finalPath = file.path.replace("temp/", "assets/");

      await mkdir(resolve(finalPath, ".."), {
        recursive: true,
      });

      await rename(resolve(`./${file.path}`), resolve(`./${finalPath}`));

      committedFiles.push(finalPath);
      file.path = finalPath;
    }
  } catch (error) {
    for (const path of committedFiles) {
      await rm(resolve(`./${path}`), { force: true });
    }

    throw error;
  }
};
export const processFiles = async ({ customPath, files, validation = [] }) => {
  const assets = [];
  for (const file of files) {
    const uploaded = await processFile({ customPath, file, validation });
    assets.push(uploaded);
  }
  return assets;
};
export const processFields = async ({
  customPath,
  fields = {},
  validation = [],
}) => {
  const assets = [];
  for (const field of Object.keys(fields)) {
    const uploaded = await processFiles({
      customPath,
      files: fields[field],
      validation,
    });
    assets.push({ field, uploaded });
  }
  return assets;
};
export const processMulterUpload = async ({
  req,
  customPath = "general",
  validation = [],
}) => {
  let files = [];

  if (req.file) {
    files = [req.file];
  } else if (Array.isArray(req.files)) {
    files = req.files;
  } else if (typeof req.files === "object" && req.files) {
    files = Object.values(req.files).flat();
  }

  const processedFiles = [];

  try {
    for (const file of files) {
      processedFiles.push(file);

      await processFile({
        customPath,
        file,
        validation,
      });
    }
    await commitFiles(processedFiles);
  } catch (error) {
    await rollbackFiles(processedFiles);
    throw error;
  }
};

export const uploadMiddleware = ({
  isRequred = true,
  multerMiddleware,
  customPath = "general",
  validation = [],
}) => {
  return (req, res, next) => {
    multerMiddleware(req, res, async (error) => {
      if (error) {
        next(new Error(error.message, { cause: { status: 400 } }));
        return;
      }

      try {
        if (
          isRequred &&
          !req.files.length &&
          !Array.isArray(req.files) &&
          !req.file &&
          !(typeof req.files == "object" && Object.keys(req.files)?.length)
        ) {
          next(BadException("file is required"));
          return;
        }
        await processMulterUpload({ customPath, validation, req });
        next();
      } catch (error) {
        next(new Error(error.message, { cause: { status: 400 } }));
      }
    });
  };
};
