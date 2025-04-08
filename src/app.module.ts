import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ColorModule } from './color/color.module';
import { ProductModule } from './product/product.module';
import { CloudinaryModue } from './cloudinary/cloudinary.module';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from "cache-manager-ioredis"

@Module({
  imports: [CacheModule.register({
    ttl:60*1000,
    store: redisStore,
    host: "localhost",
    port: 6379,
    isGlobal:true
  }),
    CloudinaryModule.forRootAsync({
      useFactory: () => ({
        cloud_name: 'dvjmihcth',
        api_key: '962915773196467',
        api_secret: 'o6LM2iqTHa0cQAMbHNUGULHVGC4',
      })
    }),
    PrismaModule, UserModule, CategoryModule, ColorModule, ProductModule, CloudinaryModue],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
