import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RouteService {
  private readonly orsApiKey = '5b3ce3597851110001cf624871cc03b182d7445eb2230bede510c04c'; // Replace with your OpenRouteService API key

  constructor(private readonly httpService: HttpService) {}

  async getRouteWithPolyline(points: { lat: number; lng: number }[]): Promise<any> {
    if (points.length < 2) {
      throw new HttpException('At least two points are required', HttpStatus.BAD_REQUEST);
    }

    const baseUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';

    // Convert points to the format required by OpenRouteService API (longitude first)
    const coordinates = points.map(p => [p.lng, p.lat]);

    const body = {
      coordinates,
      instructions: false, // Set to true if you need turn-by-turn instructions
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(baseUrl, body, {
          headers: {
            Authorization: this.orsApiKey,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch route: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
