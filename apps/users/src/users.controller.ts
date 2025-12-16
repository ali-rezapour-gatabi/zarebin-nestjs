import { Body, Controller, Patch, Post, Req, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/create-user.dto';
import { ApiBody } from '@nestjs/swagger';
import { UserUpdateDto } from './dto/update-user.dto';
import { ProfileService } from './profile.service';
import type { Request } from 'express';
import { JwtAuthGuard } from '@app/auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from 'libs/utils/storage.utils';

@Controller('identity')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('send-code')
  async sendVerificationCode(@Body('phone') phone: string) {
    const res = await this.usersService.sendVerificationCode(phone);
    return { success: res.success };
  }

  @ApiBody({ type: RegisterUserDto })
  @Post('sign-in')
  async signIn(@Body() model: RegisterUserDto) {
    const res = await this.usersService.signIn(model);
    return { success: res.success, result: res.user, token: res.token, message: 'احراض هویت با موفقیت انجام شد' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UserUpdateDto })
  @UseInterceptors(FileInterceptor('avatar', { storage: avatarStorage }))
  @Patch('update-user')
  async updateUser(@Req() req: Request, @Body() model: UserUpdateDto, @UploadedFile() file?: Express.Multer.File) {
    const { userId } = req.user as { userId: string };
    const res = await this.profileService.update(userId, model, file);
    return { success: true, result: res, message: 'ایتم مورد تظر با موفقیت ذخیره شد' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UserUpdateDto })
  @Patch('expert-user')
  async expertUser(@Body() model: UserUpdateDto, @Req() req: Request) {
    const { userId } = req.user as { userId: string };
    const res = await this.profileService.updateExpert(userId, model);
    return { success: true, result: res, message: 'ایتم مورد تظر با موفقیت ذخیره شد' };
  }
}
