import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../db/src/entities/User.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async register(dto: RegisterDto) {
    const { email, displayName, password } = dto;
    if (!email || !displayName || !password) {
      throw new HttpException('חסר נתונים', HttpStatus.BAD_REQUEST);
    }
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new HttpException('האימייל כבר רשום', HttpStatus.CONFLICT);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, displayName, passwordHash, achievements: [] });
    await this.userRepo.save(user);
    return { success: true };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    if (!email || !password)
      throw new HttpException('חסר נתונים', HttpStatus.BAD_REQUEST);
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user)
      throw new HttpException('לא נמצא משתמש', HttpStatus.UNAUTHORIZED);
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new HttpException('סיסמה שגויה', HttpStatus.UNAUTHORIZED);

    return { success: true, displayName: user.displayName };
  }
}
