import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '@/prisma.service';
import { Customer, Prisma } from '@generated/client';
import { type UUID } from 'crypto';
import { EncryptionService } from '@/common/encryption/encryption.service';
import { FindCustomersQueryDto } from './dto/find-customers-query.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService:PrismaService, private readonly encryptionService:EncryptionService){}


  async create(createCustomerDto: CreateCustomerDto) {

    const { name, middleName, lastName, email, phone, birthDate } = createCustomerDto

    const data  = {
      name,
      middleName,
      lastName,
      email:this.encryptionService.encrypt(email),
      emailHash: this.encryptionService.hash(email),
      phone:this.encryptionService.encryptOptional(phone),
      birthDate,
    }

    const customerCreated = await this.prismaService.customer.create({data})
    const customerQr = await this.prismaService.customerQr.create({data:{customerId:customerCreated.id}})


    console.log({customerCreated,customerQr})

    return customerCreated;
  }

  private buildWhere(query:FindCustomersQueryDto):Prisma.CustomerWhereInput{
    const {name,email, memberNumber, qrToken, isActive=true} = query
    const where: Prisma.CustomerWhereInput = { isActive}

    if(name){
      where.OR = [
        {name: {contains:name,mode:'insensitive'}},
        {middleName:{contains:name,mode:'insensitive'}},
        {lastName:{contains:name,mode:'insensitive'}}
      ]
    }

    if(email){
      where.emailHash = this.encryptionService.hash(email)
    }

    if(memberNumber){
      where.memberNumber = memberNumber
    }

    if(qrToken){
      where.qrCodes={some:{token:qrToken,isActive:true}}
    }

    return where

  }

  async findAll(query:FindCustomersQueryDto):Promise<Customer[]> {
    const {page=1, limit=20} = query
    const skip = (page-1) * limit
    const where = this.buildWhere(query)
    


    const [customers,total] =await Promise.all([
      this.prismaService.customer.findMany({
        where,
        skip,
        take:limit,
        orderBy:{createdAt:'desc'},
        include:{balance:true},
      }),
      this.prismaService.customer.count({where})
    ])

    return customers;
  }

  async findOneById(id: UUID):Promise<Customer> {
    const customer = await this.prismaService.customer.findUnique({where:{id}})
    if(!customer) throw new NotFoundException(`Customer with id ${id} not found`)
    return customer;
  }

  async findByEmail(email:string):Promise<Customer>{
    const customer = await this.prismaService.customer.findUnique({
      where:{emailHash:this.encryptionService.hash(email)}
    })
    if(!customer) throw new NotFoundException(`Customer with email) ${email} not found`) 

    return customer
  }

  async findByName(name:string):Promise<Customer[]>{
    const customers = await this.prismaService.customer.findMany({
      where:{
        isActive:true,
        OR:[
          {name:{contains:name,mode:'insensitive'}},
          {middleName:{contains:name,mode:"insensitive"}},
          {lastName:{contains:name,mode:'insensitive'}},
        ]
      },
      include:{balance:true}
    })

    return customers
  }



  async update(id: UUID, updateCustomerDto: UpdateCustomerDto) {
    const customerUpdated = await this.prismaService.customer.update({where:{id},data:updateCustomerDto})

    return customerUpdated;
  }

  async remove(id: UUID) {
    const customerDeleted = await this.prismaService.customer.update({where:{id},data:{isActive:false}})
    if(!customerDeleted) throw new NotFoundException(`Customer with id ${id} not found`)
    return;
  }
}
