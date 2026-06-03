import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [UsersModule, AuthModule, SessionsModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
