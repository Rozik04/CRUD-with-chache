import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Status } from 'src/enums/status.enum';
import { Role } from 'src/enums/role.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullname?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  status?: Status;
}
