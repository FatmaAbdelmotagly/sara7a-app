import { EventEmitter } from "events";
import { sendEmail } from "./send.email.js";
import { verifyEmailTemplate } from "./email.templete.js";
export const emailEvent = new EventEmitter()



emailEvent.on("sendEmail" , async({ data , recipients})=>{

    await sendEmail({
        ...recipients,
        subject : data.subject, 
        html :  verifyEmailTemplate(data)

    })

})