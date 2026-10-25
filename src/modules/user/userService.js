import { model } from "mongoose";
import { UserModel } from "../../DB/Model/userModel.js"
import {findByIdAndUpdate} from '../../common/repository/db.repo.js'
import { createLoginCredentials, createRevokeToken, userBaseRevokTokenKey, userRevokTokenKey } from "../../common/security/index.js"
import { ACCESS_TOKEN_EXPIRES_IN, REFREASH_TOKEN_EXPIRES_IN } from "../../config.js";
import { conflictException, notFoundException } from "../../common/exceptions/error.exceptions.js";
import {del, get, keys, set }from '../../common/service/cache.service.js'
import { LogoutEnum } from "../../common/enum/securityEnum.js";


const UserprofileKey = ({user})=>{
    return `User::${user._id}::CacheProfile`
}

export const profile = async (account)=>{
      
     if(!account){
        throw notFoundException("user not found ")
     }
     //cache the profile for 3 min 
     await set({
        key: UserprofileKey({ user: account }),
        value: account,
        ttl: 180
  });
  
    return account;
}
export const cacheProfile = async (user) => {
    const key = UserprofileKey({ user: user._id  });

    const account = await get({ key });

    if (account) {
        return account;
    }

    const userr = await UserModel.findById(user._id);

    return await profile(userr);
};


export const clearProfileCache = async (userId) => {
    const key = UserprofileKey({ user: { _id: userId } });
    return await del({ key });
};

export const update = async (account , data)=>{
    const user = await findByIdAndUpdate({
        model : UserModel , 
        update:data,
        id : account._id
    })
    await clearProfileCache(account._id)
    return user;

}
export const rotate = async (payLoad, user, issuer)=>{
    const accessExpiresIn =( payLoad.iat + ACCESS_TOKEN_EXPIRES_IN)*1000
    const currentTime = Date.now()+(5*60000)
    if(currentTime < accessExpiresIn) {
        throw conflictException("sorry we can not create another token while the current one is valid  ")
    }
    const data = await createLoginCredentials({user , issuer})
    await createRevokeToken(payLoad)
    return data
}

export const logout = async (payload ,user, {action=LogoutEnum.DEVICE})=>{

    switch (action) {
        case LogoutEnum.ALL : 
            user.changeCredintialTime = new Date()
            await user.save()
            await del({key : await keys({prefix : userBaseRevokTokenKey({userID : payload.sub})})})
            break;
    
        default:
            await createRevokeToken(payload)
            break;
    }
}






// export const deleteUser = async (inputs)=>{
//     const { id } = inputs
//     const user = await UserModel.deleteOne({ _id: id });
//     if (user.deletedCount === 0) {
//         throw new Error("User not found", {cause: { status: 404 }});
//     }
//     return user;
// };

// export const getUserByID = async (inputs)=>{
//     const { id } = inputs
//     const user = await UserModel.findById({ _id: id });
//     if (!user) {
//         throw new Error("User not found", {cause: { status: 404 }});
//     }
//     return user;
// };