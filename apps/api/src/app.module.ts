import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { CustomersModule } from './customers/customers.module';
import { EncryptionModule } from './common/encryption/encryption.module';
@Module({
  imports: [UsersModule, AuthModule, SessionsModule, CustomersModule, EncryptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
