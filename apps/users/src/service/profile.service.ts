import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from '../schema/users.schema';
import { UserUpdateDto } from '../dto/update-user.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Users.name) private readonly repo: Model<Users>) {}

  async update(id: string, model: UserUpdateDto, file?: Express.Multer.File) {
    if (!id) throw new NotFoundException('شناسه کاربر مورد نظر مشخص نشده');
    const updateData: Partial<Users> = {};

    if (model.firstName !== undefined) updateData.firstName = model.firstName;
    if (model.lastName !== undefined) updateData.lastName = model.lastName;
    if (model.nationalId !== undefined) updateData.nationalId = model.nationalId;
    if (model.email !== undefined) updateData.email = model.email;

    if (file) {
      updateData.avatar = file.path.replace(process.cwd(), '').replace(/\\/g, '/');
    }

    const updatedUser = await this.repo.findByIdAndUpdate(id, updateData, { new: true });
    return updatedUser;
  }
}
