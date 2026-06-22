import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaService } from '@/prisma.service';
import { QrModule } from '@/common/qr/qr.module';

@Module({
  imports:[QrModule],
  controllers: [CustomersController],
  providers: [CustomersService,PrismaService],
})
export class CustomersModule {}
