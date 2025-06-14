import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.init();
  app.listen(port, () => {
    console.log(`NestJS + Socket.io server running on http://localhost:${port}`);
  });
}

bootstrap();
