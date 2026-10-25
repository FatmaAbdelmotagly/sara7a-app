import jwt from "jsonwebtoken";
import {
  ACCESS_ADMIN_TOKEN_SEGNITURE,
  ACCESS_USER_TOKEN_SEGNITURE,
  ACCESS_TOKEN_EXPIRES_IN,
  REFREASH_ADMIN_TOKEN_SEGNITURE,
  REFREASH_USER_TOKEN_SEGNITURE,
  REFREASH_TOKEN_EXPIRES_IN,
} from "../../config.js";
import {
  BadException,
  notFoundException,
  UnauthorizedException,
} from "../exceptions/error.exceptions.js";
import { findById } from "../repository/db.repo.js";
import { UserModel } from "../../DB/Model/userModel.js";
import { TokenTypeEnum } from "../enum/security.tokenEnum.js";
import { RoleEnum } from "../enum/userEnum.js";

import { randomUUID } from "node:crypto";
import { exists, set } from "../service/cache.service.js";

export const userBaseKey = ({userID})=>{
  return `User::${userID.toString()}`
}

export const userRevokTokenKey =  ({userID, jti})=>{
  return  `${userBaseRevokTokenKey({userID})}${jti}`
}

export const userBaseRevokTokenKey =  ({userID })=>{
  return  `${userBaseKey({userID})}::Revoke_Token::`
}

export const createToken = async ({
  payLoad = {},
  options = {},
  role = RoleEnum.USER,
  secret = ACCESS_USER_TOKEN_SEGNITURE,
} = {}) => {
  return jwt.sign(payLoad, secret, options);
};
export const verifyToken = async ({
  token = "",
  secret = ACCESS_USER_TOKEN_SEGNITURE,
} = {}) => {
  return jwt.verify(token, secret);
};

const getTokenSegnitures = async ({ role = RoleEnum.USER } = {}) => {
  let Segnitures;
  switch (role) {
    case RoleEnum.ADMIN:
      Segnitures = {
        access_segniture: ACCESS_ADMIN_TOKEN_SEGNITURE,
        refreash_segniture: REFREASH_ADMIN_TOKEN_SEGNITURE,
      };
      break;
    case RoleEnum.USER:
      Segnitures = {
        access_segniture: ACCESS_USER_TOKEN_SEGNITURE,
        refreash_segniture: REFREASH_USER_TOKEN_SEGNITURE,
      };
      break;
    default:
      Segnitures = {
        access_segniture: ACCESS_USER_TOKEN_SEGNITURE,
        refreash_segniture: REFREASH_USER_TOKEN_SEGNITURE,
      };
      break;
  }
  return Segnitures;
};

const getSegniture = async ({ tokenType, role = RoleEnum.USER }) => {
  const segnitures = await getTokenSegnitures({ role: role });

  return tokenType == TokenTypeEnum.ACCESS
    ? segnitures.access_segniture
    : segnitures.refreash_segniture;
};
export const decodeToken = async ({
  authorization,
  tokenType = TokenTypeEnum.ACCESS,
} = {}) => {
  const decoded = jwt.decode(authorization);
  // console.log(decoded);

  if (!decoded?.aud?.length) {
    throw BadException("missing token payLoad");
  }

  const payLoad = await verifyToken({
    token: authorization,
    secret: await getSegniture({ tokenType, role: decoded.aud[0] }),
  });

  if (!payLoad?.sub) {
    throw BadException("missing token payLoad ");
  }

  if(await exists({key : userRevokTokenKey({userID : payLoad.sub , jti : payLoad.jti})})){
      throw UnauthorizedException("Expired login credintials")
  }
  const user = await findById({ model: UserModel, id: payLoad.sub });
  if (!user) {
    throw notFoundException("user not found ");
  }
  if(user.changeCredintialTime?.getTime() ?? 0 > payLoad.iat * 1000){
    throw UnauthorizedException ("Expired login credintials")
  }
  return { user, payLoad };
};

export const createLoginCredentials = async ({
  user,
  issuer,
  options = {},
}) => {
  const { access_segniture, refreash_segniture } = await getTokenSegnitures({
    role: user.role,
  });
  const jwtid = randomUUID();
  const access_token = await createToken({
    payLoad: { sub: user._id },
    secret: access_segniture,
    options: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      jwtid
    },
  });
  const refreash_token = await createToken({
    payLoad: { sub: user._id },

    secret: refreash_segniture,
    options: {
      issuer,
      audience: [user.role],
      expiresIn: REFREASH_TOKEN_EXPIRES_IN,
      jwtid
    },
  });

  return { access_token, refreash_token };
};

export const createRevokeToken = async (payload)=> {
   const consumedTime = (Math.ceil(Date.now() / 1000 )- payload.iat)
      const refreshExpiresIn = payload.iat + REFREASH_TOKEN_EXPIRES_IN
      const ttl = refreshExpiresIn - consumedTime
  
      await set({key : userRevokTokenKey({userID : payload.sub , jti : payload.jti}) , value :payload.jti , ttl})
     
      
}

