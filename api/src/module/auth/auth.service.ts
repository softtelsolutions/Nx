// auth.service.ts (Simplified without SMS/Redis)
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { UsersService } from "../users/users.service";
import { User } from "../users/user.entity";
import {
  LoginDto,
  MobileLoginDto,
  VerifyOtpDto,
  RefreshTokenDto
} from "../../dto/auth.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // In-memory storage for OTP (use Redis in production)
  private otpStore = new Map<string, { mobile: string, otp: string, userId: number, expires: number }>();

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async passwordLogin(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.generateAuthTokens(user);
  }

  async initiateMobileLogin(mobileLoginDto: MobileLoginDto) {
    const { mobile, countryCode } = mobileLoginDto;
    const fullMobile = `${countryCode}${mobile}`;

    // Check if user exists
    const user = await this.userService.findByMobile(fullMobile);
    if (!user) {
      throw new BadRequestException('User not found. Please register first.');
    }

    // Generate OTP
    const otp = this.generateOtp();
    const requestId = `otp_${Date.now()}_${randomInt(1000, 9999)}`;
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP in memory
    this.otpStore.set(requestId, {
      mobile: fullMobile,
      otp,
      userId: user.id,
      expires
    });

    // Cleanup old OTPs
    this.cleanupExpiredOtps();

    // In production, implement SMS sending here
    this.logger.log(`OTP ${otp} sent to ${fullMobile} (Request ID: ${requestId})`);

    return {
      requestId,
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Only return OTP in dev
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { requestId, otp, mobile } = verifyOtpDto;

    // Retrieve OTP data
    const otpData = this.otpStore.get(requestId);
    if (!otpData) {
      throw new BadRequestException('OTP expired or invalid request');
    }

    // Check expiry
    if (Date.now() > otpData.expires) {
      this.otpStore.delete(requestId);
      throw new BadRequestException('OTP expired');
    }

    // Validate mobile and OTP
    if (mobile !== otpData.mobile || otp !== otpData.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Get user
    const user = await this.userService.findById(otpData.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate auth tokens
    const tokens = await this.generateAuthTokens(user);

    // Cleanup used OTP
    this.otpStore.delete(requestId);

    return tokens;
  }

  async generateAuthTokens(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.mail,
      mobile: user.mobile,
      roles: user.role,
      companyId: user.company_id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.mail,
        mobile: user.mobile,
        role: user.role?.name,
        companyId: user.company_id,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900, // 15 minutes in seconds
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto;

      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Get user
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      return await this.generateAuthTokens(user);

    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByName(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  private generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  private cleanupExpiredOtps() {
    const now = Date.now();
    for (const [key, value] of this.otpStore.entries()) {
      if (now > value.expires) {
        this.otpStore.delete(key);
      }
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      if (payload.type === 'refresh') {
      //  await this.redisService.del(`refresh:${payload.sub}`);
      }
    } catch (error) {
      // Token might be expired, just ignore
    }
  }
}
