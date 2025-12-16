import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatTabSchema } from './schema/chat-tab.schema';
import { AiChatSchema } from './schema/ai-chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ChatTab', schema: ChatTabSchema },
      { name: 'AiChat', schema: AiChatSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
