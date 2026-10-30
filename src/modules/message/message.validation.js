import mongoose from 'mongoose'
import {file, optional, z} from 'zod'
import { generalValidationFields } from '../../common/validation.js'

export const createMessage =(lang)=>{

    return z.object({
        body : z.strictObject({
            content : z.string().min(2).max(50000).optional(),
            recieverId :generalValidationFields.Id(lang)
        }),
        files : z.array(generalValidationFields.file(lang)).max(3).optional()
    }).superRefine((data , ctx)=>{
        if(!data.body.content && !data.files?.length){
            ctx.addIssue({
                code : "custom",
                path : ['content'],
                message : "missing message content"
            })
        }
    })

}