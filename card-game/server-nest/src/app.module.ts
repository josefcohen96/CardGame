import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketGateway } from '../src/sockets/socket.gateway';
import { RoomEvents } from './sockets/events/room.events';
import { GameEvents } from './sockets/events/game.events';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['dist/db/src/entities/*.entity.js'],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway, RoomEvents, GameEvents],
})
export class AppModule { }