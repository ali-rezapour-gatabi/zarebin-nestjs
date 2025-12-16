import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, Users } from './schema/users.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/create-user.dto';
import { AuthService } from '@app/auth';
import { Otp } from './schema/otp.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly repo: Model<Users>,
    @InjectModel(Otp.name) private readonly otpRepo: Model<Otp>,
    private readonly jwtService: AuthService,
  ) {}

  async sendVerificationCode(phone: string) {
    const existsOtp = await this.otpRepo.findOne({ phoneNumber: phone });
    if (existsOtp) {
      throw new HttpException('کد قبلاً ارسال شده است، لطفاً صبر کنید', HttpStatus.BAD_REQUEST);
    }

    const code = '123456';

    await this.otpRepo.create({
      phoneNumber: phone,
      code,
      expiresAt: new Date(),
    });

    return { success: true };
  }

  async signIn(model: RegisterUserDto) {
    const otp = await this.otpRepo.findOne({
      phoneNumber: model.phoneNumber,
      code: model.code,
    });

    if (!otp) {
      throw new HttpException('کد نامعتبر یا منقضی شده است', HttpStatus.BAD_REQUEST);
    }

    await this.otpRepo.deleteOne({ _id: otp._id });

    let user = await this.repo.findOne({ phoneNumber: model.phoneNumber });

    if (!user) {
      user = await this.repo.create({
        phoneNumber: model.phoneNumber,
        firstName: model.firstName,
        lastName: model.lastName,
        role: Role.User,
      });
    }

    const token = this.jwtService.generateToken(String(user._id), user.phoneNumber!);

    return { success: true, token, user };
  }
}
