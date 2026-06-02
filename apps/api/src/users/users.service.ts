import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma.service';
import { User, Prisma } from '@generated/client'
import { type UUID } from 'crypto';

import { NotFoundException } from '@nestjs/common'
import { hashValue } from '@/common/utils/hash.util';

export type SaveUser = Omit<User,'passwordHash'>;

// !Important, check password doesnt send with SaveUser in update

@Injectable()
export class UsersService {
  
  constructor(private readonly prisma:PrismaService){}

  async create(createUserDto: CreateUserDto):Promise<SaveUser> {

    const passwordHashed = await hashValue(createUserDto.password)

    const data:Prisma.UserCreateInput = {
      email:createUserDto.email,
      passwordHash:passwordHashed,
      name:createUserDto.name,
      role:createUserDto.role
    }

    const {passwordHash, ...user } = await this.prisma.user.create({data})

    return user;
  }

  async findAll():Promise<SaveUser[]> {
    const users = await this.prisma.user.findMany({where:{isActive:true},omit:{passwordHash:true}});
    return users;
  }

  async findOne(id: UUID):Promise<SaveUser> {
    const user = await this.prisma.user.findUnique({where:{id},omit:{passwordHash:true}})
    if (!user) throw new NotFoundException(`User ${id} not found`)
    return user;
  }

  async findOneByEmail(email:string):Promise<User>{
    const user = await this.prisma.user.findUnique({where:{email}})
    if (!user) throw new NotFoundException({code:404,message:'Email not found'})
      
    return user
  }

  async update(id: UUID, updateUserDto: UpdateUserDto):Promise<SaveUser> {
    const userUpdated  = await this.prisma.user.update({where:{id},data:updateUserDto,omit:{passwordHash:true}})
    return userUpdated;
  }

  async remove(id: UUID) {
    return await this.prisma.user.update({where:{id},data:{isActive:false},omit:{passwordHash:true}});
  }
}
