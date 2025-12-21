import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatTabSchema } from './schema/chat-tab.schema';
import { AiChatSchema } from './schema/content-chat.schema';
import { ChatTabService } from './service/chat-tab.service';
import { ContentChatService } from './service/content-chat.service';
import { NlpModule } from '@app/nlp';
import { ExpertsSchema } from 'apps/users/src/schema/experts.schema';

@Module({
  imports: [
    NlpModule,
    MongooseModule.forFeature([
      { name: 'ChatTab', schema: ChatTabSchema },
      { name: 'AiChat', schema: AiChatSchema },
      { name: 'Experts', schema: ExpertsSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatTabService, ContentChatService],
})
export class ChatModule {}
