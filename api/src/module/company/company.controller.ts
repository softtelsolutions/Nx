import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpStatus } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import {CustomExceptionFilter} from "../../filter/custom-exception.filter";

@Controller('company')
@UseFilters(CustomExceptionFilter)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() company: Company) {
    try {
      const data = this.companyService.create(company);
      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
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

  @Get()
  findAll() {
    try {
      const data = this.companyService.findAll();
      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      const data = this.companyService.findOne(+id);
      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() company: Company) {
    try {
      const data = this.companyService.update(+id, company);
      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      const data = this.companyService.remove(+id);
      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
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
