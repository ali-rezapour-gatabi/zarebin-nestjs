import { Body, Controller, Patch, Post, Req, UseGuards, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { RegisterUserDto } from './dto/create-user.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UserUpdateDto } from './dto/update-user.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from '@app/auth';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ExpertService, UsersService, ProfileService } from './service';
import { filesStorage } from 'libs/utils/storage.utils';

@Controller('identity')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly exportService: ExpertService,
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
  @UseInterceptors(FileInterceptor('avatar', { storage: filesStorage }))
  @ApiConsumes('multipart/form-data')
  @Patch('update-user')
  async updateUser(@Req() req: Request, @Body() model: UserUpdateDto, @UploadedFile() file?: Express.Multer.File) {
    const { userId } = req.user as { userId: string };
    const res = await this.profileService.update(userId, model, file);
    return { success: true, result: res, message: 'ایتم مورد تظر با موفقیت ذخیره شد' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('documents', 3, { storage: filesStorage }))
  @ApiConsumes('multipart/form-data')
  @Post('expert-user')
  async updateExpert(@Req() req: Request, @Body() model: UserUpdateDto, @UploadedFiles() documents: Express.Multer.File[]) {
    const { userId } = req.user as { userId: string };
    return this.exportService.updateExpert(userId, model, documents);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-expert')
  async getExeprt(@Req() req: Request) {
    const { userId } = req.user as { userId: string };
    const res = await this.exportService.getExperts(userId);
    return { success: true, result: res, message: 'اعملیات مورد تظر با موفقیت دریافت شد' };
  }
}
