import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { CustomersModule } from './customers/customers.module';
import { EncryptionModule } from './common/encryption/encryption.module';
import { QrModule } from './common/qr/qr.module';
@Module({
  imports: [UsersModule, AuthModule, SessionsModule, CustomersModule, EncryptionModule, QrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
