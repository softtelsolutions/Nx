import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpStatus, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';
import {CustomExceptionFilter} from "../../filter/custom-exception.filter";

@Controller('attendance')
@UseFilters(CustomExceptionFilter)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post()
  async create(@Body() attendance: Attendance) {
    try {
      const data = await this.attendanceService.create(attendance);
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
      const data = this.attendanceService.findAll();
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
      const data = this.attendanceService.findOne(+id);
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

  @Get('emp/:id')
  async findAllByEmployee(@Param('id') id: string) {
    try {
      const data = await this.attendanceService.findAllByEmployee(+id);
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

  @Get('dt/:date/usr/:id')
  async findByEmployeeAndDate(@Param('date') date: Date, @Param('id') id: number): Promise<any> {
    try {
      const data = await this.attendanceService.findByEmployeeAndDate(+id, date);
      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Internal server error',
        data: {},
      };
    }
  }

  @Get('dt/:date')
  async findAllByDate(@Param('date') date: Date): Promise<any> {
    try {
      const data = await this.attendanceService.findAllByDate(date);
      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Internal server error',
        data: {},
      };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() attendance: Attendance) {
    try {
      const data = await this.attendanceService.update(+id, attendance);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      const data = this.attendanceService.remove(+id);
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

  @Get('/present/:date')
  async getPresentEmployees(@Param('date') date: Date) {
    try{
      const data = await this.attendanceService.findPresentEmployees(date);
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

  @Get('/absent/:date')
  async getAbsentEmployees(@Param('date') date: Date) {
    try{
      const data = await this.attendanceService.findAbsentEmployees(date);
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

  @Get('/leave/:date')
  async getLeaveEmployees(@Param('date') date: Date) {
    try{
      const data = await this.attendanceService.findLeaveEmployees(date);
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

  @Get('/summary/:date')
  async getAttendanceSummary(@Param('date') date: Date) {
    try{
      const data = await this.attendanceService.getAttendanceSummary(date);
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
