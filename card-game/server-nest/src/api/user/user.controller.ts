import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }
}
