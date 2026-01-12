import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {CustomExceptionFilter} from "../../filter/custom-exception.filter";
import {Roles} from "../../decorator/roles.decorator";
import {RolesGuard} from "../../guard/roles.guard";

@Controller('users')
@UseFilters(CustomExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() user: User) {
    try {
      const data = await this.usersService.create(user);
      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
      };
    } catch (err) {
      // Handle any errors and return an error response
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err || 'Internal server error',
        data: {},
      };
    }
  }

  @Get()
  @Roles('Admin')
  @UseGuards(RolesGuard)
  findAll() {
    try {
      const data = this.usersService.findAll();
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

  @Get('/role/:role/active')
 async findAllByRole(@Param('role') role: string) {
    try {
      const data = await this.usersService.findAllByRole(role);
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
        data: [],
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.usersService.findById(+id);
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
  @Roles('Admin')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() user: User) {
    try {
      const data = this.usersService.update(+id, user);
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
  @Roles('Admin')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    try {
      const data = this.usersService.remove(+id);
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
