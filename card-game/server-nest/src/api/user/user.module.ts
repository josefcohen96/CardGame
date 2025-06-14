import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../../db/src/entities/User.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule { }