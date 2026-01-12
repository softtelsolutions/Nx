import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { User } from '../users/user.entity';
import { BusinessOnboardController } from './business_onboard.controller';
import { UsersService } from '../users/users.service';
import { CompanyService } from '../company/company.service';
import { BusinessOnboardService } from './business_onboard.service';
import {Role} from "../../models/roles.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, Role])],
  controllers: [BusinessOnboardController],
  providers: [BusinessOnboardService, CompanyService, UsersService],
})
export class BusinessOnboardModule { }
