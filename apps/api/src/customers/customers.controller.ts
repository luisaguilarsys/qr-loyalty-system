import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '@generated/client';
import { type UUID } from 'crypto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto):Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll():Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: UUID):Promise<Customer> {
    return this.customersService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateCustomerDto: UpdateCustomerDto):Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID):Promise<void> {
    return this.customersService.remove(id);
  }
}
