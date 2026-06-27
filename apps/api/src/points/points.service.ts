import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { type UUID } from 'crypto';
import { PrismaService } from '@/prisma.service';
import { TransactionType } from '@generated/enums';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPointDto: CreatePointDto, cashierId: UUID) {
    const normalizedPoints =
      createPointDto.type == TransactionType.EARN
        ? Math.abs(createPointDto.points)
        : createPointDto.type == TransactionType.REDEEM
          ? -Math.abs(createPointDto.points)
          : createPointDto.points;

    const transaction = await this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: createPointDto.customerId, isActive: true },
        include: { balance: true },
      });
      if (!customer) throw new NotFoundException('Customer not found');
      if (!customer.balance) throw new NotFoundException('Balance not found');

      const newPoints = customer.balance.points + normalizedPoints;

      if (newPoints < 0) {
        throw new NotFoundException('Insufficient points');
      }

      const updatedBalance = await tx.customerBalance.update({
        where: { customerId: createPointDto.customerId },
        data: { points: newPoints },
      });

      const transaction = await tx.pointTransaction.create({
        data: {
          customerId: createPointDto.customerId,
          cashierId,
          type: createPointDto.type,
          points: normalizedPoints,
          description: createPointDto.description,
        },
      });

      return { transaction, newBalance: updatedBalance.points };
    });

    return transaction;
  }

  async getBalance(id: UUID) {
    const balance = await this.prisma.customerBalance.findUnique({
      where: {
        customerId: id,
      },
    });

    return balance;
  }
  async getHistory(id: UUID) {
    const history = await this.prisma.pointTransaction.findMany({
      where: { customerId: id },
    });

    return history;
  }
}
