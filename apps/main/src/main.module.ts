import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { UsersModule } from 'apps/users/src/users.module';
import { ExeptionTraceModule } from '@app/exeption-trace';
import { ChatModule } from 'apps/chat/src/chat.module';

@Module({
  imports: [DatabaseModule, UsersModule, ExeptionTraceModule, ChatModule],
  providers: [],
})
export class MainModule {}
