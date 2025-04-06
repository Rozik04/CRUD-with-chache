import {Controller,Get,Post,Body,Patch,Request,Param,Delete,ParseIntPipe, UseInterceptors, UploadedFile, UseGuards,} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { upload } from 'src/multer';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from 'src/middlewares/auth.middleware';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/send")
  sendOtp(@Body() body:{email:string}){
    return this.userService.sendOtp(body.email)
  }

  @Post("/verify")
  verifyOtp(@Body() body:{email:string, otp:string}){
    return this.userService.verifyOtp(body.email, body.otp)
  } 

  @Patch("/register")
  register(@Body() createUserDto: RegisterUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('/login')
  login(@Body() body:{email: string, password:string}) {
    return this.userService.login(body.email, body.password);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', upload))
  uploadImage(@UploadedFile() image:Express.Multer.File){
    if(!image){
      return "file no uploaded"
    }
    return {file:image.filename}
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    let userId = req.user.id;
    return this.userService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Post(":id")
  @UseInterceptors(FileInterceptor("image", upload))
  updateImage(@Param("id", ParseIntPipe) id:number ,@UploadedFile() file: Express.Multer.File){
    return this.userService.updateImage(id, file)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
