import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';

const { PORT = 4000 } = process.env;
const { IP_HOST = 'localhost' } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT);
}

bootstrap()
  .then(() => {
    console.log(IP_HOST, PORT);
    console.log(`[API] Server: http://${IP_HOST}:${PORT}`);
  })
  .catch((err) => {
    console.error('[API] Error: Unable to initialize server');
    console.error(err);
  });
