import {config} from 'dotenv'
import {resolve} from 'node:path'
export const NODE_ENV = process.env.NODE_ENV
config({path : resolve(`.env.${NODE_ENV}`) });

export const PORT = process.env.PORT

export const DB_URI = process.env.DB_URI

export const DB_NAME = process.env.DB_NAME
export const IV_LENGTH = parseInt(process.env.IV_LENGTH)
export const SALT = parseInt(process.env.SALT ?? "12")
export const ENC_KEY = process.env.ENC_KEY 
export const ACCESS_ADMIN_TOKEN_SEGNITURE = process.env.ACCESS_ADMIN_TOKEN_SEGNITURE
export const ACCESS_USER_TOKEN_SEGNITURE = process.env.ACCESS_USER_TOKEN_SEGNITURE
export const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN ?? "18000")


export const REFREASH_USER_TOKEN_SEGNITURE = process.env.REFREASH_USER_TOKEN_SEGNITURE
export const REFREASH_ADMIN_TOKEN_SEGNITURE = process.env.REFREASH_ADMIN_TOKEN_SEGNITURE
export const REFREASH_TOKEN_EXPIRES_IN = parseInt(process.env.REFREASH_TOKEN_EXPIRES_IN ?? "86400285")
export const REDIS_URI = process.env.REDIS_URI
export const APP_EMAIL = process.env.APP_EMAIL
export const APP_PASSWORD = process.env.APP_PASSWORD
export const APPLICATION_NAME = process.env.APPLICATION_NAME
export const WEB_CLIENT_IDS = process.env.WEB_CLIENT_IDS.split(",")