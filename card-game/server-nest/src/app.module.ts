import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { RoomModule } from './api/room/room.module';
import { GameModule } from './api/game/game.module';
import { SocketsModule } from './sockets/socket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    UserModule,
    RoomModule,
    GameModule,
    SocketsModule,
  ],
  controllers: [AppController], //  do i need this ? 

  providers: [
    AppService,  // and this ? 
  ],
})
export class AppModule { }
