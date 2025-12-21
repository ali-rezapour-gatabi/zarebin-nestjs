import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatTabService } from './service/chat-tab.service';
import { JwtAuthGuard } from '@app/auth';
import type { Request } from 'express';
import { ContentChatService } from './service/content-chat.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatTabService,
    private readonly contentChatService: ContentChatService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-chat-tab')
  createChatTab(@Body('title') title: string, @Req() req: Request) {
    const { userId } = req.user as { userId: string };
    return this.chatService.createChatTab(userId, String(title));
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-chat-tabs')
  getChatTabs(@Req() req: Request) {
    const { userId } = req.user as { userId: string };
    return this.chatService.getChatTabs(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete-chat-tab')
  deleteChatTabs(@Body('id') id: string, @Req() req: Request) {
    const { userId } = req.user as { userId: string };
    return this.chatService.deleteChatTab(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-message')
  createContentChat(@Body('chatTabId') chatTabId: string, @Body('message') message: string, @Req() req: Request) {
    const { userId } = req.user as { userId: string };
    return this.contentChatService.createContentChat(userId, { chatTabId, message });
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-conversations')
  getContentChats(@Body('slug') slug: string, @Req() req: Request) {
    const { userId } = req.user as { userId: string };
    return this.contentChatService.getContentChats(userId, slug);
  }
}
