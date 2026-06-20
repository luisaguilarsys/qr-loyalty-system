import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGHT = 16;
const AUTH_TAG_LENGTH=16;


@Injectable()
export class EncryptionService {
  private readonly key: Buffer

  constructor() {
    const hex = process.env.ENCRYPTION_KEY
    if( hex?.length!==64) throw new Error('invalid ENCRYPTION_KEY')
    this.key = Buffer.from(hex,'hex')
  }


  encrypt(plainText:string):string{
    const iv = crypto.randomBytes(IV_LENGHT)
    const cipher = crypto.createCipheriv(ALGORITHM,this.key,iv)
    const encrypted = Buffer.concat([cipher.update(plainText,'utf8'),cipher.final()])
    const authTag = cipher.getAuthTag()

    return Buffer.concat([iv,authTag,encrypted]).toString('base64')
  }
  
  encryptOptional(plainText:string|undefined):string | undefined{
    return plainText?this.encrypt(plainText):undefined
  }

  decrypt(cipherText:string):string{
    const buf = Buffer.from(cipherText,'base64')
    const iv = buf.subarray(0,IV_LENGHT)
    const authTag = buf.subarray(IV_LENGHT,IV_LENGHT+AUTH_TAG_LENGTH)
    const encrypted = buf.subarray(IV_LENGHT+AUTH_TAG_LENGTH)

    const decipher = crypto.createDecipheriv(ALGORITHM,this.key,iv)
    decipher.setAuthTag(authTag)
    
    return decipher.update(encrypted) + decipher.final('utf8')
  }

  hash(value:string):string{
    return crypto.createHmac('sha256',this.key).update(value.toLowerCase().trim()).digest('hex')
  }

}
