import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Users } from '../schema/users.schema';
import { Experts } from '../schema/experts.schema';
import { UserUpdateDto } from '../dto/update-user.dto';
import { NlpService } from '@app/nlp';
import { normalizePersian } from 'libs/utils/normalize-text.utils';

@Injectable()
export class ExpertService {
  private readonly REQUIRED_USER_FIELDS = ['firstName', 'lastName', 'nationalId', 'phoneNumber'] as const;

  constructor(
    @InjectModel(Users.name) private readonly userRepo: Model<Users>,
    @InjectModel(Experts.name) private readonly expertRepo: Model<Experts>,
    private readonly nlpService: NlpService,
  ) {}

  async updateExpert(userId: string, model: UserUpdateDto, files?: Express.Multer.File[]) {
    if (!userId) {
      throw new BadRequestException('شناسه کاربر مورد نظر مشخص نشده');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('شناسه کاربر نامعتبر است');
    }

    await this.validateUserCompleteness(userId);

    const expert = await this.upsertExpert(userId, model, files);

    return expert;
  }

  private async validateUserCompleteness(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId).select(this.REQUIRED_USER_FIELDS.join(' ')).lean().exec();

    if (!user) {
      throw new ForbiddenException('کاربر یافت نشد');
    }

    const missingFields = this.REQUIRED_USER_FIELDS.filter((field) => {
      const value = user[field];
      return value === null || value === undefined || value === '';
    });

    if (missingFields.length > 0) {
      throw new ForbiddenException(`لطفاً ابتدا اطلاعات کاربری خود را تکمیل کنید: ${missingFields.join(', ')}`);
    }
  }

  private async upsertExpert(userId: string, model: UserUpdateDto, files?: Express.Multer.File[]) {
    const keywords = await this.nlpService.analyzeText({
      domains: model.domains,
      subdomains: model.subdomains,
      skills: model.skills,
      description: model.description,
    });
    const keywordNormalized = keywords.keywords.map((keyword: string) => normalizePersian(keyword));
    const updateData: any = {
      domains: model.domains,
      subdomains: model.subdomains,
      skills: model.skills,
      description: model.description,
      yearsOfExperience: model.yearsOfExperience,
      contactLinks: model.contactLinks,
      contactNumbers: model.contactNumbers,
      availability: model.availability,
      sampleJob: model.sampleJob,
      province: model.province,
      city: model.city,
      location: model.location,
      searchKeywords: keywordNormalized,
    };

    if (files && files.length > 0) {
      const newDoc = files.map((file) => (updateData.documents = file.path.replace(process.cwd(), '').replace(/\\/g, '/')));
      updateData.documents = [model.documents ?? [], ...newDoc];
    } else {
      updateData.documents = model.documents;
    }

    const now = new Date();

    const expert = await this.expertRepo
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            ...updateData,
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

  async getExperts(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('شناسه کاربر نامعتبر است');
    }
    const experts = await this.expertRepo
      .findOne({ userId })
      .select('userId domains subdomains skills description yearsOfExperience documents contactLinks contactNumbers availability province city location createdBy updatedBy')
      .lean()
      .exec();

    return experts;
  }
}
