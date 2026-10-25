import { forbiddenException, UnauthorizedException } from "../common/exceptions/index.js"
import { decodeToken } from "../common/security/index.js"
import {  TokenTypeEnum } from "../common/enum/index.js";


export const authentication = (tokenType=TokenTypeEnum.ACCESS)=>{

    return async (req,res,next) =>{
    const authHeader = req.headers.authorization;
    const authorization = authHeader.split(" ")[1];
      //console.log({authorization});
    
    if(!authorization){
        throw UnauthorizedException("unaithorized account ")
    }
    req.headers.authorization = authorization
    const{user ,payLoad} =await decodeToken({authorization , tokenType})
    req.user = user
    req.payLoad = payLoad
    
    next()
}}



export const authorization = (accessRole)=>{

    return async (req,res,next) =>{
        // if(!accessRole.includes(req.user.role)){
        //     throw forbiddenException("forbidden user")

        // }
        if(req.user.role < accessRole){
            throw forbiddenException("forbidden user")

        }
    
    
       next()
}}