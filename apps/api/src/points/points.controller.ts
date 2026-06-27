import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { type UUID } from 'crypto';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('adjust')
  create(@Body() createPointDto: CreatePointDto, @Request() req: any) {
    const cashierId = req.user.sub;
    return this.pointsService.create(createPointDto, cashierId);
  }

  @Get('balance/:id')
  findAll(@Param('id') id: UUID) {
    return this.pointsService.getBalance(id);
  }

  @Get('history/:id')
  findOne(@Param('id') id: UUID) {
    return this.pointsService.getHistory(id);
  }
}
