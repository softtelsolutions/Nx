import { Controller, Post, Body, UseFilters, HttpStatus, UnauthorizedException, HttpException } from '@nestjs/common';
import {CustomExceptionFilter} from "../../filter/custom-exception.filter";
import {AuthService} from "./auth.service";
import {LoginDto, MobileLoginDto, RefreshTokenDto, VerifyOtpDto} from "../../dto/auth.dto";


@Controller('auth')
@UseFilters(CustomExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.passwordLogin(loginDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result,
    };
  }

  @Post('login/mobile')
  async mobileLogin(@Body() mobileLoginDto: MobileLoginDto) {
    const result = await this.authService.initiateMobileLogin(mobileLoginDto);
    return {
      statusCode: HttpStatus.OK,
      message: result.message,
      data: {
        requestId: result.requestId,
        mobile: mobileLoginDto.mobile
      },
    };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const result = await this.authService.verifyOtp(verifyOtpDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'OTP verified successfully',
      data: result,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.authService.refreshToken(refreshTokenDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Token refreshed successfully',
      data: result,
    };
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    await this.authService.logout(body.refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: 'Logout successful',
      data: {},
    };
  }
}
