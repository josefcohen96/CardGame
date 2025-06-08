import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { createServer } from 'http';


const rooms = new Map<string, any>();

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');

  const expressApp = app.getHttpAdapter().getInstance();
  const server = createServer(expressApp);

  const port = process.env.PORT || 3000;
  await app.init();
  server.listen(port, () => {
    console.log(`NestJS + Socket.io server running on http://localhost:${port}`);
  });
}

bootstrap();
