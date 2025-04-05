import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
