import { Router } from "express";
import { authentication  } from "../../middelWare/authentication.middleware.js";
import { getAllIdentityRequests, requestIdentity, respondToIdentityRequest } from "./identityRequest.service.js";
import { successResponse } from "../../common/utils/successResponse.js";
const router = Router()
import * as validators from './identityRequest.validation.js'
import { validation } from "../../middelWare/validation.middleware.js";
router.post("/:messageId" , authentication() , validation(validators.requestIdentity),async (req , res , next )=>{
    const  status = await requestIdentity(req.params , req.user)
    successResponse({res , status : 201 , data : status , message:"Identity request created successfully"})
})

router.patch("/response/:messageId",authentication(),
    validation(validators.respondToIdentityRequest),
    async (req, res, next) => {
        const data = await respondToIdentityRequest( { messageId: req.params.messageId },{status: req.body.status,user: req.user });
        return successResponse({ res, data });
    }
);

router.get("/",authentication(),
    validation(validators.getAllIdentityRequests),
    async (req, res, next) => {
        const data = await getAllIdentityRequests( { page: req.query.page , limit : req.query.limit} , req.user);
        return successResponse({ res, data });
    }
);


export default router 