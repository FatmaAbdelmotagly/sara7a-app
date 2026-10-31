import { notFoundException } from "../../common/exceptions/error.exceptions.js";
import { countDocuments, createOne, deleteOne, find, findById, findOne, paginate } from "../../common/repository/db.repo.js";
import { messageModel } from "../../DB/Model/messageModel.js";
import { UserModel } from "../../DB/Model/userModel.js";



export const createMessage = async ({content , recieverId}={} , files = [] , user = undefined)=>{
    const existResever = await findById({
        model : UserModel,
        id: recieverId
    })
    // console.log({existResever});

    if(!existResever){
        throw notFoundException("invalid reciever id ")
    }
console.log({user});

    const message = await createOne({
        model : messageModel,
         data: {
            recieverId,
            content,
            attachment: files.map(ele => ele.path),
            ...(user ? { senderId: user._id } : {})
        },

    })
    return message;
}

export const deleteMessage = async ({messageId},user)=>{
   const data = await deleteOne({model : messageModel , filter : {recieverId : user._id , _id : messageId}})
   if(!data.deletedCount){
    throw notFoundException("invalid message id ")
   }
    return data ;
}

export const getMessage = async ({messageId})=>{
      const data = await findOne({model : messageModel , filter : { _id : messageId}})
   if(!data){
    throw notFoundException("invalid message id ")
   }
   console.log("Message from DB:", data.toObject());
    return data ;
}
export const getAllMessages = async ({type , page , limit}={},user)=>{
    let filter ={}
    if(type == "0"){
        filter =   { recieverId: user._id }
    }else if(type == "1"){
        filter = { senderId: user._id }
    }else {
      filter = {$or: [
        { senderId: user._id },
        { recieverId: user._id }
      ]}
    }

    const data = await paginate({model : messageModel , page , limit , filter , options : {sort :{ createdAt : -1}}})
return data 
}