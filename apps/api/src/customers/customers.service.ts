import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '@/prisma.service';
import { Customer } from '@generated/client';
import { type UUID } from 'crypto';

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService:PrismaService){}


  async create(createCustomerDto: CreateCustomerDto) {
    const customerCreated = await this.prismaService.customer.create({data:createCustomerDto})

    return customerCreated;
  }

  async findAll():Promise<Customer[]> {
    const customers =await this.prismaService.customer.findMany()
    return customers;
  }

  async findOneById(id: UUID):Promise<Customer> {
    const customer = await this.prismaService.customer.findUnique({where:{id}})
    if(!customer) throw new NotFoundException(`Customer with id ${id} not found`)
    return customer;
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
