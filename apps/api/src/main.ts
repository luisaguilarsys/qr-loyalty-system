import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { PORT = 4000 } = process.env;
const { IP_HOST = 'localhost' } = process.env;

async function bootstrap() {
  if (process.env.NODE_ENV != 'production') {
    await import('dotenv/config');
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log(`[API]: Server: http://${IP_HOST}:${PORT}`))
  .catch((err) => {
    console.error('[API]: Error: Unable to initialize server');
    console.error(err);
  });
