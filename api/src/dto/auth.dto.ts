import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
  IsPhoneNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class MobileLoginDto {
  @ApiProperty({ example: '91' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be 10 digits' })
  mobile: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{6}$/, { message: 'OTP must be 6 digits' })
  otp: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
