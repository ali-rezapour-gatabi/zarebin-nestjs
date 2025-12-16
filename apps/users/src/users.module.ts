import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './schema/users.schema';
import { Experts, ExpertsSchema } from './schema/experts.schema';
import { TransactionService } from '@app/database/transation.service';
import { AuthModule } from '@app/auth';
import { Otp, OtpSchema } from './schema/otp.schema';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      { name: Experts.name, schema: ExpertsSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, TransactionService, ProfileService],
})
export class UsersModule {}
