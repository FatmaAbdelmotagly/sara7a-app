 
 import {z} from'zod'
import { GenderEnum, LangEnum } from './enum/index.js'


const matchFields = ({ original, copy, data, ctx, lang }) => {
    if (data[original] != data[copy]) {
        ctx.addIssue({
            code: "custom",
            path: [copy],
            message:
                lang == LangEnum.AR
                    ? `فشل التطابق بين ${original} و ${copy}`
                    : `Fail to match between ${original} and ${copy}`
        });
    }
};


 export const generalValidationFields = {
    email : (lang) =>{return z.email({message : (lang ) == LangEnum.AR ? "الايميل غير صحيح " :"invalid email format please add valid one "})},
    password : z.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)(?=.*[!@#$%^_&*()]).{8,16}/),
    username :(lang)=>{ return z.string().min(2,{ message : (lang) == LangEnum.AR  ? "يجب ان يحتوي الاسم علي الاقل حرفين " : "minimum length is 2 chars "})} ,
    phone : z.e164(),
    gender : z.enum(GenderEnum),
    otp : z.string().regex(/^\d{6}$/ , {error:"invalid code"}),
    confirmPassword : z.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)(?=.*[!@#$%^_&*()]).{8,16}/) ,
    matchFields 
    
 }