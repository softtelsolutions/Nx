import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpStatus } from '@nestjs/common';
import { BusinessOnboardService } from './business_onboard.service';
import {CustomExceptionFilter} from "../../filter/custom-exception.filter";
import {BusinessOnboardDTO} from "../../dto/business_onboard.dto";

@Controller('business_onboard')
@UseFilters(CustomExceptionFilter)
export class BusinessOnboardController {
  constructor(private readonly businessOnboardService: BusinessOnboardService,
  ) { }

  @Post()
  async create(@Body() businessOnboardDTO: BusinessOnboardDTO) {
    try {
      const data = await this.businessOnboardService.create(businessOnboardDTO);
      return {
        statusCode: 200,
        message: 'Request successful',
        data: data ,
      };
    } catch (error) {
      // Handle any errors and return an error response
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Internal server error',
        data: {},
      };
    }
  }

}
