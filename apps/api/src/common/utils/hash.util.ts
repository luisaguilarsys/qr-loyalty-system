import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = process.env.SALT_ROUNDS ?? 10 ;

export const hashValue = (value:string)=> bcrypt.hash(value, SALT_ROUNDS);


export const hashCompare = (value: string, hash: string) => bcrypt.compare(value, hash);