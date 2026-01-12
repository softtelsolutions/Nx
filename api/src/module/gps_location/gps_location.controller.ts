import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpStatus } from '@nestjs/common';
import { GPSLocation } from './gps_location.entity';
import { GPSLocationService } from './gps_location.service';
import {CustomExceptionFilter} from "../../filter/custom-exception.filter";

@Controller('gps_location')
@UseFilters(CustomExceptionFilter)
export class GPSLocationController {
  constructor(private readonly gpsLocationService: GPSLocationService) { }

  @Post()
  create(@Body() address: GPSLocation) {
    try {
      const data = this.gpsLocationService.create(address);
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
        data: null,
      };
    }
  }

  @Get()
  findAll() {
    try {
      const data = this.gpsLocationService.findAll();
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
      const data = this.gpsLocationService.findOne(+id);
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

  @Get('user/:id/dt/:date')
  async getGpsLocation(
    @Param('id') userId: number,
    @Param('date') date: Date,
  ) {
    try {
      const data = this.gpsLocationService.getGpsLocation(userId, date);
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

  @Get('user/:id/dt/:date/crnt')
  async getCurrentGpsLocation(
    @Param('id') userId: number,
    @Param('date') date: Date,
  ) {
    try {
      const data = this.gpsLocationService.getGpsLocation(userId, date);
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
  update(@Param('id') id: string, @Body() address: GPSLocation) {
    try {
      const data = this.gpsLocationService.update(+id, address);
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
      const data = this.gpsLocationService.remove(+id);
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
