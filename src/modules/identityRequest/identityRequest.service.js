import { getMessage } from "../message/message.service.js"
import { BadException, conflictException, forbiddenException, notFoundException } from "../../common/exceptions/error.exceptions.js";
import { createOne, find, findById, findOne, paginate, updateOne } from "../../common/repository/db.repo.js";
import { messageModel } from "../../DB/Model/messageModel.js";
import { IdentityRequest } from "../../DB/Model/identityRequest.model.js";
import { StatusEnum } from "../../common/enum/status.enum.js";
import { model } from "mongoose";
import { UserModel } from "../../DB/Model/userModel.js";
import { decryption } from "../../common/security/encryption.security.js";
import { createConversation } from "../conversation/conversation.service.js";


export const requestIdentity = async ({ messageId } = {}, user) => {
    const message = await getMessage({ messageId });
    if (!message) {
        throw notFoundException("Message id not found");
    }

    if (user._id.toString() != message.recieverId.toString()) {
        throw forbiddenException("You are not allowed to request this identity");
    }
 if (message.senderId && user._id.toString() === message.senderId.toString()) {
    throw forbiddenException("You cannot request your own identity");
}
    const existingReq = await findOne({
        model: IdentityRequest,
        filter: { messageId }
    });
    if (existingReq) {
        throw conflictException("Identity request already exists");
    }
    const request = await createOne({
        model: IdentityRequest,
        data: {
            messageId,
            requesterId: user._id,
            status: StatusEnum.PENDING
        }
    });
    console.log({request});
    
    return request;
};


export const respondToIdentityRequest = async ({ messageId } = {},{ status, user } = {}) => {
    const request = await findOne({
        model: IdentityRequest,
        filter: { messageId }
    });
    if (!request) {
        throw notFoundException("Request not found");
    }
    if (request.status !== StatusEnum.PENDING) {
        throw BadException("Request already answered");
    }
    const message = await findById({
        model: messageModel,
        id: messageId
    });
    if (!message) {
        throw notFoundException("Message not found");
    }
    if (message.senderId.toString() != user._id.toString()) {
        throw forbiddenException("You are not allowed to respond to this request");
    }
   const result = await updateOne({ model: IdentityRequest,filter: { messageId, status: StatusEnum.PENDING},update: { status }
    });
    if(status == StatusEnum.ACCEPTED){
        const requesterData = await findOne({model : UserModel , filter : {_id : message.senderId}}) 
        const phone = await decryption(requesterData.phone)
        const conversation = await createConversation(request._id)
        return {result , conversation ,user: {email :requesterData.email , name : requesterData.username  , phone }};
    }
    
    return result ;
};



export const getAllIdentityRequests = async ({ page, limit } = {}, user) => {
    const messages = await find({model: messageModel,filter: { senderId: user._id},select: "_id"});
    if(!messages){
        throw notFoundException("there is no requests")
    }
    const messageIds = messages.map(message => message._id);
    const data = await paginate({ model: IdentityRequest,filter: {messageId: { $in: messageIds } },
        page,
        limit,
        options: {
            sort: { createdAt: -1 }
        }
    });
    return data;
};