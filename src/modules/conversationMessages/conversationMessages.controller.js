import { fileValidation, localFileUpload, uploadMiddleware } from "../../common/utils/multer/local.js";
import { authentication } from "../../middelWare/authentication.middleware.js";
import { validation } from "../../middelWare/validation.middleware.js";
import { getAllConversations, getConversationMessages, sendConversationMessage } from "./conversationMessages.service.js";
import {Router} from "express"
const router = Router() 
import * as validators from '../message/message.validation.js'
import { successResponse } from "../../common/utils/successResponse.js";

const messageFolderName = "chats"

router.post("/:conversationId", authentication(),
    uploadMiddleware({
    multerMiddleware: localFileUpload().any("attachment", 3),
    validation: fileValidation.image,
    isRequred: false,
    customPath: messageFolderName,
  }),validation(validators.createMessage),
    async (req, res, next) => {
        const message = await sendConversationMessage({conversationId:req.params.conversationId,content: req.body.content}, req.files,req.user);
        successResponse({status: 201,data: message,res});}
);

router.get("/:conversationId", authentication(),validation(validators.allMessage), async (req, res, next) => {
        const message = await getConversationMessages( {conversationId:req.params.conversationId},req.user);
        successResponse({status: 201,data: message,res});}
);

router.get("/", authentication(),validation(validators.getAllConversations), async (req, res, next) => {
        const message = await getAllConversations( {page: req.query.page,limit: req.query.limit},req.user);
        successResponse({status: 201,data: message,res});}
);


export default router