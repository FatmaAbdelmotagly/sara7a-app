import { Router } from "express";
import { successResponse } from "../../common/utils/successResponse.js";
import { createMessage, deleteMessage, getAllMessages, getMessage } from "./message.service.js";
import {
  fileValidation,
  localFileUpload,
  uploadMiddleware,
} from "../../common/utils/multer/local.js";
import { validation } from "../../middelWare/validation.middleware.js";
import * as validators from "./message.validation.js";
import { authentication } from "../../middelWare/authentication.middleware.js";
import { decodeToken } from "../../common/security/token.securtiy.js";
const router = Router({caseSensitive : true});
const messageFolderName = "messages";

router.post(
  "/",
  async (req, res, next) => {
    if (req.header["authorization"]) {
      const authorization = req.header["authorization"]?.split(" ")[1] || [];
      const { user, payLoad } = await decodeToken({ authorization : authorization});
      req.user = user;
      req.payLoad = payLoad;
    }
    next();
  },
  uploadMiddleware({
    multerMiddleware: localFileUpload().any("attachment", 3),
    validation: fileValidation.image,
    isRequred: false,
    customPath: messageFolderName,
  }),
  validation(validators.createMessage),
  async (req, res, next) => {
    const data = await createMessage(req.body, req.files, req.user);
    return successResponse({ status: 201, res, data });
  },
);

router.post(
  "/by-account",
  authentication(),
  uploadMiddleware({
    multerMiddleware: localFileUpload().any("attachment", 3),
    validation: fileValidation.image,
    isRequred: false,
    customPath: messageFolderName,
  }),
  validation(validators.createMessage),
  async (req, res, next) => {
    const data = await createMessage(req.body, req.files, req.user);
    return successResponse({ status: 201, res, data });
  },
);


router.get("/getAllMessages" ,authentication(),
validation(validators.allMessage) ,async(req, res , next )=>{
   const data = await getAllMessages(req.validate.query , req.user)
     return successResponse({ status: 200, res, data });
})
router.get("/:messageId" ,authentication(),
validation(validators.deleteMessage) ,async(req, res , next )=>{
   const data = await getMessage(req.validate.params )
     return successResponse({ status: 200, res, data });
})
router.delete("/:messageId" ,authentication(),
validation(validators.deleteMessage) ,async(req, res , next )=>{
   const data = await deleteMessage(req.validate.params , req.user)
     return successResponse({ status: 200, res, data });
})
export default router;
