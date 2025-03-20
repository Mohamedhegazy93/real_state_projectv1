import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  userName: string;
  @IsNotEmpty()
  @IsEmail()
  @Length(10, 50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  password: string;


  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
