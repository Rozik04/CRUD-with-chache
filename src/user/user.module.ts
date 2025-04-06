import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [ PrismaModule, JwtModule.register({secret:"Mysecret", signOptions:{expiresIn:"2h"}})]
})
export class UserModule {}
