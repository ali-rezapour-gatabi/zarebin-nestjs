import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatDto } from '../dto/chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AiChat } from '../schema/content-chat.schema';
import { Model } from 'mongoose';
import { NlpService, PromptType } from '@app/nlp';
import { Experts } from 'apps/users/src/schema/experts.schema';

@Injectable()
export class ContentChatService {
  constructor(
    @InjectModel(AiChat.name) private readonly chatModel: Model<AiChat>,
    @InjectModel(Experts.name) private readonly expertModel: Model<Experts>,
    private readonly nlpService: NlpService,
  ) {}

  async createContentChat(userId: string, model: ChatDto) {
    // ۱. اعتبارسنجی اولیه ورودی‌ها
    if (!model?.chatTabId || !model?.message) {
      throw new Error('اطلاعات چت (شناسه تب یا متن پیام) ناقص است');
    }
    if (!userId) {
      throw new Error('شناسه کاربر مشخص نشده است');
    }

    try {
      const [keywordResult] = await Promise.all([this.nlpService.analyzeText(model.message, PromptType.MESSAGE)]);
      let analysis: string | undefined;

      const keywords = Array.isArray(keywordResult.keywords) ? keywordResult.keywords : [];
      console.log(keywords);

      let experts: any;
      if (keywords.length > 0) {
        experts = await this.expertModel
          .find({
            searchKeywords: {
              $elemMatch: {
                $regex: new RegExp(keywords.join('|'), 'i'),
              },
            },
          })
          .limit(10)
          .exec();
      }
      console.log(experts);

      const newChat = await this.chatModel.create({
        chatTabId: model.chatTabId,
        message: model.message,
        analysis: 'hi',
        experts: [],
        createdAt: new Date(),
      });

      return {
        analysis,
        experts,
        chatId: newChat._id,
        success: true,
      };
    } catch (error) {
      console.error('Error in createContentChat:', error);
      throw new InternalServerErrorException(`خطا در پردازش درخواست چت: ${error.message}`);
    }
  }

  async getContentChats(userId: string, chatTabId: string) {
    if (!userId) {
      throw new Error('شناسه کاربر مورد نظر مشخص نشده');
    }
    if (!chatTabId) {
      throw new Error('شناسه گفتگو مشخص نشده');
    }
    try {
      const chats = await this.chatModel.find({ chatTabId }).exec();
      return { success: true, chats };
    } catch {
      throw new Error('خطا در دریافت گفتگوها');
    }
  }
}
