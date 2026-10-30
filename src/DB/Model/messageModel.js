import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum/index.js";
import { Timestamp } from "mongodb";
import { maxLength, minLength } from "zod";

const messageSchema = mongoose.Schema({
    content : {
        type : String,
        require : function(){return this.attachment?.length > 0 ? false : true},
        minLength:2,
        maxLength : 50000
    },
    attachment : {
        type : [String],
    },
    senderId :{
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    recieverId : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        require :true
    }
},{
    Timestamp : true,
    
})

export const messageModel = mongoose.model("message" , messageSchema)