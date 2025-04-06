import { Controller, Inject, Injectable, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'nestjs-cloudinary';

@Controller("upload")
export class CloudinaryController {
constructor(private readonly cloudinaryService: CloudinaryService){}
@Post()
@UseInterceptors(FileInterceptor("image"))
async create(@UploadedFile() image:Express.Multer.File){
  let {url} = await this.cloudinaryService.uploadFile(image)
  return {url}
}
} 
