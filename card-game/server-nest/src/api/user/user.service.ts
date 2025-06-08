import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../db/src/entities/User.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const { email, displayName, password } = dto;
    console.log('Registering user:', dto);
    if (!email || !displayName || !password) {
      throw new HttpException('חסר נתונים', HttpStatus.BAD_REQUEST);
    }
    console.log('Checking if user exists with email:', email);
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new HttpException('האימייל כבר רשום', HttpStatus.CONFLICT);
    console.log('Hashing password for user:', email);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, displayName, passwordHash, achievements: [] });
    await this.userRepo.save(user);
    return { success: true };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    console.log('Logging in user:', dto);
    if (!email || !password)
      throw new HttpException('חסר נתונים', HttpStatus.BAD_REQUEST);
    const user = await this.userRepo.findOne({ where: { email } });
    console.log('Found user:', user ? user.email : 'not found');
    if (!user)
      throw new HttpException('לא נמצא משתמש', HttpStatus.UNAUTHORIZED);
    const ok = await bcrypt.compare(password, user.passwordHash);
    console.log('Password comparison result:', ok);
    if (!ok) throw new HttpException('סיסמה שגויה', HttpStatus.UNAUTHORIZED);
    console.log('User logged in successfully:', user.email);

    const payload = { userId: user.id, email: user.email, displayName: user.displayName };
    const token = this.jwtService.sign(payload);
    return { success: true, token, displayName: user.displayName };
  }

  
}
