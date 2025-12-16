import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schema/users.schema';
import { Model, Types } from 'mongoose';
import { UserUpdateDto } from './dto/update-user.dto';
import { Experts } from './schema/experts.schema';
import { posix as pathPosix } from 'path';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Users.name) private readonly repo: Model<Users>,
    @InjectModel(Experts.name) private readonly expertRepo: Model<Experts>,
  ) {}

  async update(id: string, model: UserUpdateDto, file?: Express.Multer.File) {
    if (!id) throw new NotFoundException('شناسه کاربر مورد نظر مشخص نشده');
    const updateData: Partial<Users> = {};

    if (model.firstName !== undefined) updateData.firstName = model.firstName;
    if (model.lastName !== undefined) updateData.lastName = model.lastName;
    if (model.nationalId !== undefined) updateData.nationalId = model.nationalId;
    if (model.email !== undefined) updateData.email = model.email;
    if (file) {
      updateData.avatar = pathPosix.join('assets', 'user', file.filename);
    }

    const updatedUser = await this.repo.findByIdAndUpdate(id, updateData, { new: true });
    return updatedUser;
  }

  async updateExpert(userId: string, model: UserUpdateDto) {
    if (!userId) throw new BadRequestException('شناسه کاربر مورد نظر مشخص نشده');

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('شناسه کاربر نامعتبر است');
    }

    const requiredFields = ['firstName', 'lastName', 'nationalId', 'phoneNumber'] as const;

    const user = await this.repo.findById(userId).select(requiredFields.join(' ')).lean().exec();

    if (!user) {
      throw new ForbiddenException('کاربر یافت نشد');
    }

    const missingFields = requiredFields.filter((f) => {
      const v = user[f];
      return v === null || v === undefined || v === '';
    });

    if (missingFields.length) {
      throw new ForbiddenException(`لطفاً ابتدا اطلاعات کاربری خود را تکمیل کنید: ${missingFields.join(', ')}`);
    }

    const now = new Date();

    const expert = await this.expertRepo
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            domains: model.domains,
            subdomains: model.subdomains,
            skills: model.skills,
            bio: model.bio,
            documents: model.documents,
            contacts: model.contacts,
            experienceYears: model.experienceYears,
            updatedBy: userId,
            updatedAt: now,
          },
          $setOnInsert: {
            userId,
            createdBy: userId,
            createdAt: now,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      )
      .lean()
      .exec();

    return expert;
  }
}
