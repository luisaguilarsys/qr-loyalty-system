import { Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.settings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: {
        id: 'singleton',
      },
    });

    return settings;
  }

  async update(updateSettingDto: UpdateSettingDto) {
    const settingsUpdated = await this.prisma.settings.update({
      where: { id: 'singleton' },
      data: updateSettingDto,
    });

    return settingsUpdated;
  }
}
