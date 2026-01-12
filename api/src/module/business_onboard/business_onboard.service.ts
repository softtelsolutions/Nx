import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CompanyService } from '../company/company.service';
import {BusinessOnboardDTO} from "../../dto/business_onboard.dto";

@Injectable()
export class BusinessOnboardService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly userService: UsersService
  ) { }

  async create( businessOnboardDTO: BusinessOnboardDTO): Promise<any> {
    const company = await this.companyService.create(businessOnboardDTO.company);
    businessOnboardDTO.user.company_id = company.id;
    const user = await this.userService.create(businessOnboardDTO.user);
    return {
      userId: user.id,
        username: user.username,
        password: user.password,
        companyId: user.company_id
    };
  }
}
