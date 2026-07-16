import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '@/prisma.service';
import { Customer, Prisma } from '@generated/client';
import { type UUID } from 'crypto';
import { EncryptionService } from '@/common/encryption/encryption.service';
import { FindCustomersQueryDto } from './dto/find-customers-query.dto';
import { QrService } from '@/common/qr/qr.service';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly qrService: QrService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { name, middleName, lastName, email, phone, birthDate } =
      createCustomerDto;

    const data = {
      name,
      middleName,
      lastName,
      email: this.encryptionService.encrypt(email),
      emailHash: this.encryptionService.hash(email),
      phone: this.encryptionService.encryptOptional(phone),
      birthDate,
    };

    const customerCreated = await this.prismaService.$transaction(
      async (tx) => {
        const customer = await tx.customer.create({ data });

        await tx.customerQr.create({
          data: {
            customerId: customer.id,
            reason: 'new member',
          },
        });

        await tx.customerBalance.create({
          data: {
            customerId: customer.id,
            points: 0,
          },
        });

        return customer;
      },
    );

    return customerCreated;
  }

  private buildWhere(query: FindCustomersQueryDto): Prisma.CustomerWhereInput {
    const { name, email, memberNumber, qrToken, isActive = true } = query;
    const where: Prisma.CustomerWhereInput = { isActive };

    if (name) {
      where.OR = [
        { name: { contains: name, mode: 'insensitive' } },
        { middleName: { contains: name, mode: 'insensitive' } },
        { lastName: { contains: name, mode: 'insensitive' } },
      ];
    }

    if (email) {
      where.emailHash = this.encryptionService.hash(email);
    }

    if (memberNumber) {
      where.memberNumber = memberNumber;
    }

    if (qrToken) {
      where.qrCodes = { some: { token: qrToken, isActive: true } };
    }

    return where;
  }

  async findAll(query: FindCustomersQueryDto): Promise<Customer[]> {
    const { page, limit, skip } = query;
    const where = this.buildWhere(query);

    const [customers, total] = await Promise.all([
      this.prismaService.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { balance: true },
      }),
      this.prismaService.customer.count({ where }),
    ]);

    return customers;
  }

  async findOneById(id: UUID): Promise<Customer> {
    const customer = await this.prismaService.customer.findUnique({
      where: { id },
    });
    if (!customer)
      throw new NotFoundException(`Customer with id ${id} not found`);
    return customer;
  }

  async findByEmail(email: string): Promise<Customer> {
    const customer = await this.prismaService.customer.findUnique({
      where: { emailHash: this.encryptionService.hash(email) },
    });
    if (!customer)
      throw new NotFoundException(`Customer with email) ${email} not found`);

    return customer;
  }

  async findByName(name: string): Promise<Customer[]> {
    const customers = await this.prismaService.customer.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: name, mode: 'insensitive' } },
          { middleName: { contains: name, mode: 'insensitive' } },
          { lastName: { contains: name, mode: 'insensitive' } },
        ],
      },
      include: { balance: true },
    });

    return customers;
  }

  async update(id: UUID, updateCustomerDto: UpdateCustomerDto) {
    const customerUpdated = await this.prismaService.customer.update({
      where: { id },
      data: updateCustomerDto,
    });

    return customerUpdated;
  }

  async remove(id: UUID) {
    const customerDeleted = await this.prismaService.customer.update({
      where: { id },
      data: { isActive: false },
    });
    if (!customerDeleted)
      throw new NotFoundException(`Customer with id ${id} not found`);
    return;
  }

  // Qr Code generation for customers

  async getQrImage(customerId: string): Promise<Buffer> {
    const qrRecord = await this.prismaService.customerQr.findFirst({
      where: { customerId, isActive: true },
    });

    if (!qrRecord) throw new NotFoundException('Qr record not found');

    return this.qrService.generateQrBuffer({ v: 1, token: qrRecord.token });
  }

  // Re-generate a new Qr Code for customer

  async regenerateQr(customerId: string, reason?: string) {
    await this.prismaService.customerQr.updateMany({
      where: { customerId, isActive: true },
      data: { isActive: false, deactivatedAt: new Date() },
    });

    const newCustomerQr = await this.prismaService.customerQr.create({
      data: { customerId, reason },
    });

    return this.qrService.generateQrBuffer({
      v: 1,
      token: newCustomerQr.token,
    });
  }
}
