import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.env.NODE_ENV != 'production') {
    await import('dotenv/config');
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().then(() =>
  console.log(`Server: http://localhost:${process.env.PORT ?? 3000}`),
);
