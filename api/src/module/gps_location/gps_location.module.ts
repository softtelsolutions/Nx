import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GPSLocation } from './gps_location.entity';
import { GPSLocationService } from './gps_location.service';
import { GPSLocationController } from './gps_location.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GPSLocation])], 
    exports: [GPSLocationService],
  controllers: [GPSLocationController],
  providers: [GPSLocationService],
})
export class GPSLocationModule {}
