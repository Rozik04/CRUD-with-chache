import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as nodemailer from 'nodemailer'
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import {promises as fs} from "fs"



@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private jwt: JwtService) {}

  async sendOtp(email:string) {  
    let checkUser = await this.prisma.user.findFirst({where:{email:email}}) 
    
    if(checkUser){
      throw new BadRequestException("Bu email ro'yxatdan o'tib bo'lgan!")
    }
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.prisma.otp.create({data:{code:otp, email:email}});
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yusupovruzimuhammad4@gmail.com',
        pass: 'vzbo fult mpnb gudy',
      },
    });
    
    await transporter.sendMail({
      from: 'yusupovruzimuhammad4@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });
  
    await this.prisma.user.create({
      data: {
        fullname: "", 
        email: email, 
        password: "",
        image: "", 
        role: "User", 
        status: "Inactive", 
      },
    });   
     return { message: 'OTP sent successfully' }; 
  }

  async verifyOtp(email:string, otp: string){
    let checkData = await this.prisma.otp.findFirst({where:{email:email}});
    if(!checkData){
      throw new BadRequestException("Xatolik yuz berdi!")
    }
    if(checkData.code==otp&&checkData.email==email){
      await this.prisma.user.update({where:{email},data:{status:"Active"}})
      await this.prisma.otp.deleteMany({where:{email:email}})
      return {message:'Otp verified successfully!'}
    }
  }

  async register(createUserDto: RegisterUserDto) {
    let checkUsersStatus = await this.prisma.user.findFirst({where:{email:createUserDto.email}});
    if(!checkUsersStatus){
      return {error:"Bu email ro'yxatdan o'tmagan"}
    }
    let {fullname, email, password, image, role} = createUserDto
    
    if(checkUsersStatus?.status!=="Active"){
      return {error:'Sizning statusingiz aktivlashtirilmagan!'}
    }
    let hash = bcrypt.hashSync(password, 10);
    
    let registeredUser = await this.prisma.user.update({where:{email:email}, data:{fullname, password:hash, image, role}});
    if(registeredUser){
      return {message:'User successfully registered!'}
    }
  }

  async login(email: string, password:string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    let pass = bcrypt.compareSync(password, user.password)
    if(!pass){
      return {Error:"Wrong password!"};
    }
    let token = this.jwt.sign({role:user.role})
    return {user, token};
  }

  async findAll() {
    return  this.prisma.user.findMany()
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let  hash = updateUserDto.password?bcrypt.hashSync(updateUserDto.password,10):undefined;
    return this.prisma.user.update({
      where: { id },
      data:{ ...updateUserDto, password:hash},
    });
  }

  async updateImage(id: number, file: Express.Multer.File) {
    const checkUser = await this.prisma.user.findFirst({ where: { id } });
    if (!checkUser) {
      throw new BadRequestException("User not found");
    }
    console.log(checkUser.image);
  
    if (checkUser.image) {
      try {
        const impath = path.join(__dirname, "../../uploads", checkUser.image);
        await fs.unlink(impath);
      } catch (err) {
        console.error(`Xatolik yuz berdi: ${err.message}`);
      }
    }
  
    return { image: file.filename };
  }
  
  async remove(id: number) {
    let checkUser = await this.prisma.user.findFirst({where:{id}});
    if(!checkUser){
      throw new BadRequestException("Not found user");
    }
      if (checkUser.image) {
        try {
            let impath = path.join(__dirname, "../../uploads", checkUser.image);
            await fs.unlink(impath); 
        } catch (err) {
            console.error(`Xatolik yuz berdi: ${err.message}`);
        }
    }
    return this.prisma.user.delete({
      where: { id },
    });
  }




}
