import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService, ExpertService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './schema/users.schema';
import { Experts, ExpertsSchema } from './schema/experts.schema';
import { TransactionService } from '@app/database/transation.service';
import { AuthModule } from '@app/auth';
import { Otp, OtpSchema } from './schema/otp.schema';
import { ProfileService } from './service/profile.service';
import { NlpModule } from '@app/nlp';

@Module({
  imports: [
    AuthModule,
    NlpModule,
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      { name: Experts.name, schema: ExpertsSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, TransactionService, ExpertService, ProfileService],
})
export class UsersModule {}
