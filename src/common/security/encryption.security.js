import crypto from 'node:crypto'
import { ENC_KEY, IV_LENGTH } from '../../config.js'

export const encryption = async (planeText)=>{
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipherIV = crypto.createCipheriv("aes-256-cbc", ENC_KEY,iv)
    let cipherText = cipherIV.update(planeText , 'utf-8' , 'hex') 
    cipherText += cipherIV.final("hex")

    return `${iv.toString("hex")}::${cipherText}`
}
export const decryption = async (cipherText)=>{
    const [hexIV , encryptedData]=cipherText.split("::")
    const iv = Buffer.from(hexIV , 'hex')

    const decipherIV = crypto.createDecipheriv("aes-256-cbc", ENC_KEY,iv)
     let planeText = decipherIV.update(encryptedData , 'hex' , 'utf-8') 
    planeText += decipherIV.final("utf-8")

    return planeText
}