import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() customer: Customer) {
    try {
      const data = this.customersService.create(customer);
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
  async findAll() {
    try {
      const data = await this.customersService.findAll();
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

  @Get("/dealers_distributors")
  async getDealersAndDistributors() {
    try {
      const types = ['Dealer', 'Distributor'];
      const data = await this.customersService.findByTypes(types);

      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'Internal server error',
        data: null,
      };
    }
  }

  @Get("/farmers")
  async getFarmers() {
    try {
      const types = ['Farmer'];
      const data = await this.customersService.findByTypes(types);

      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'Internal server error',
        data: null,
      };
    }
  }

  @Get('salesman/:id')
  async findBySalesmanId(@Param('id') id: number) {
    try {
      const data = await this.customersService.findBySalesmanId(id);
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

  @Get("/dealers_distributors/salesman/:id")
  async getDealersAndDistributorsBySalesman(@Param('id') id: number) {
    try {
      const types = ['Dealer', 'Distributor'];
      const data = await this.customersService.findByTypesAndSalesman(types, id);

      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'Internal server error',
        data: null,
      };
    }
  }

  @Get("/farmers/salesman/:id")
  async getFarmersBySalesman(@Param('id') id: number) {
    try {
      const types = ['Farmer'];
      const data = await this.customersService.findByTypesAndSalesman(types, id);

      return {
        statusCode: 200,
        message: 'Request successful',
        data: data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'Internal server error',
        data: null,
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      const data = this.customersService.findOne(+id);
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
  update(@Param('id') id: string, @Body() customer: Customer) {
    try {
      const data = this.customersService.update(+id, customer);
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
      const data = this.customersService.remove(+id);
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
