import { Module } from '@nestjs/common';
import { QrService } from './qr.service';

@Module({
  providers: [QrService]
})
export class QrModule {}
