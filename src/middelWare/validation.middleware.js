import { Query } from "mongoose";
import { BadException } from "../common/exceptions/error.exceptions.js";
import { LangEnum } from "../common/enum/securityEnum.js";


export const validation = (schema)=>{
    return (req,res,next)=>{
        const lang =Number( req.headers['accept-language'] ?? LangEnum.EN) ;
        console.log({lang})
        
const validationResult =schema(lang).safeParse({
    body : req.body,
    query : req.query,
    headers : req.headers,
    params : req.params
})
      if(!validationResult.success){

    throw BadException("validation error", validationResult.error.issues);
 
    }
    req.validate = validationResult.data
    next()
    }
 }