import { notFoundException } from "../../common/exceptions/error.exceptions.js";
import { createOne, findById } from "../../common/repository/db.repo.js";
import { messageModel } from "../../DB/Model/messageModel.js";
import { UserModel } from "../../DB/Model/userModel.js";



export const createMessage = async ({content , recieverId}={} , files = [] , user = undefined)=>{
    const existResever = await findById({
        model : UserModel,
        id: recieverId
    })
    console.log({existResever});
    

    if(!existResever){
        throw notFoundException("invalid resever id ")
    }

    const message = await createOne({
        model : messageModel,
        data : {
            recieverId , 
            content,
            attachment : files.map(ele => ele.path),
            ...(user? {senderId : user._id} : {} )
        },

    })
    return message;
}