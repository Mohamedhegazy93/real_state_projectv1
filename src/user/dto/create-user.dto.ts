import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
  NotContains,
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
  @IsPhoneNumber('EG')
  @MinLength(11, { message: 'phone number must be 11 at least nunbers' })
  @MaxLength(11, { message: 'phone number must be 11 at most nunbers' })
  @NotContains(' ', { message: 'no space allowed' })
  @IsOptional()
  phoneNumber: string;


  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
