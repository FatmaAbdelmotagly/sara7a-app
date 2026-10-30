import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { BadException } from "../../exceptions/error.exceptions.js";
import { asyncWrapProviders } from "node:async_hooks";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  files: ["application/pdf", "application/json"],
};

export const localFileUpload = ({ maxFileSize = 5, validation = [] }={}) => {
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

  if (!result || !validation.includes(result.mime)) {
    throw BadException("invalid file format");
  } else {
    mkdir(resolve(`./assets/${customPath}`), { recursive: true });
    const uniqepath = `assets/${customPath}/${randomUUID()}.${result.ext}`;
    await writeFile(resolve(`./${uniqepath}`), file.buffer);
    file.path = uniqepath;
  }

  return file;
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
    validation = []
}) => {
    if (req.file) {
        await processFile({
            customPath,
            file: req.file,
            validation
        });
    } else if (Array.isArray(req.files)) {
        await processFiles({
            customPath,
            files: req.files,
            validation
        });
    } else if (
        typeof req.files == "object" &&
        Object.keys(req.files)?.length
    ) {
        await processFields({
            customPath,
            fields: req.files,
            validation
        });
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
        next(new Error(error.message, { cause: { status: 400 } }))
        return;
    }
    

    try {
        if(isRequred &&( (!req.files.length && !Array.isArray(req.files))&& !req.file)&& !(typeof req.files == "object" && Object.keys(req.files)?.length)){
        next(BadException("file is required"))
         return;
    }
        await processMulterUpload({ customPath, validation, req })
        next()
    } catch (error) {
        next(new Error(error.message, { cause: { status: 400 } }))

    }

})  
}}

