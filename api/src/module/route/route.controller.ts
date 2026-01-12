import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { RouteService } from './route.service';

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get('polylines')
  async getRoute(@Query('points') points: string): Promise<any> {
    try {
      const pointArray = JSON.parse(points);
      if (!Array.isArray(pointArray)) {
        throw new HttpException('Invalid points format', HttpStatus.BAD_REQUEST);
      }
      return await this.routeService.getRouteWithPolyline(pointArray);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
