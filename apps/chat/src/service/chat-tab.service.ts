import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatTab } from '../schema/chat-tab.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';

@Injectable()
export class ChatTabService {
  constructor(@InjectModel('ChatTab') private readonly chatTabRepo: Model<ChatTab>) {}

  async createChatTab(userId: string, title: string) {
    if (!userId) {
      throw new ConflictException('شناسه کاربر مورد نظر مشخص نشده');
    }
    try {
      const saved = await this.chatTabRepo.create({ userId, title: title, slug: nanoid(10), createdAt: new Date(), isDeleted: false });
      return { success: true, slug: saved.slug };
    } catch {
      throw new InternalServerErrorException('خطا در ایجاد گفتگو');
    }
  }

  async getChatTabs(userId: string) {
    if (!userId) {
      throw new ConflictException('شناسه کاربر مورد نظر مشخص نشده');
    }
    try {
      const chatTabs = await this.chatTabRepo.find({ userId, isDeleted: false });
      return { success: true, chat: chatTabs };
    } catch {
      throw new InternalServerErrorException('خطا در دریافت گفتگوها');
    }
  }

  async deleteChatTab(userId: string, id: string) {
    if (!userId) {
      throw new ConflictException('شناسه کاربر مورد نظر مشخص نشده');
    }
    try {
      await this.chatTabRepo.updateOne({ _id: id, userId }, { isDeleted: true, deletedAt: new Date() });
      return { success: true };
    } catch {
      throw new InternalServerErrorException('خطا در دریافت گفتگوها');
    }
  }
}
