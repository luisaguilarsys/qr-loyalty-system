import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Header, StreamableFile } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '@generated/client';
import { type UUID } from 'crypto';
import { FindCustomersQueryDto } from './dto/find-customers-query.dto';
import { RegenerateCustomerQrDto } from './dto/regenerate-customer-qr.dto';


@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto):Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll(@Query() query: FindCustomersQueryDto):Promise<Customer[]> {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID):Promise<Customer> {
    return this.customersService.findOneById(id);
  }

  // QR Code endpoint
  @Get(':id/qr')
  @Header('Content-Type','image/png')
  @Header('Cache-Control','no-store')
  async getQr(@Param('id') id:UUID):Promise<StreamableFile>{
    const buffer = await this.customersService.getQrImage(id)
    return new StreamableFile(buffer)
  }

  @Post(':id/qr/regenerate')
  async regenerateQr(@Param('id') id:UUID,@Body() body: RegenerateCustomerQrDto,):Promise<StreamableFile>{
    const buffer = await this.customersService.regenerateQr(id,body.reason)

    return new StreamableFile(buffer)
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
