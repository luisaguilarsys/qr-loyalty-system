import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { PORT = 4000 } = process.env;
const { IP_HOST = 'localhost' } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
