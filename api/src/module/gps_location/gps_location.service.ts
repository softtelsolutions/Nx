import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GPSLocation } from './gps_location.entity';

@Injectable()
export class GPSLocationService {
  constructor(
    @InjectRepository(GPSLocation)
    private gpslocationRepository: Repository<GPSLocation>,
  ) { }

  create(gps: GPSLocation): Promise<GPSLocation> {
    const gpslocation = this.gpslocationRepository.create(gps);
    return this.gpslocationRepository.save(gpslocation);
  }

  findAll(): Promise<GPSLocation[]> {
    return this.gpslocationRepository.find();
  }

  getGpsLocation(userId: number,
    selectedDate: Date): Promise<GPSLocation[]> {
    return this.gpslocationRepository.find({ where: { user_id: userId, date: selectedDate } });
  }

  getCurrentGpsLocation(userId: number,
    selectedDate: Date): Promise<GPSLocation> {
    const data = this.gpslocationRepository.findAndCount({ where: { user_id: userId, date: selectedDate } });
    return data[length - 1];
  }

  findOne(id: number): Promise<GPSLocation> {
    return this.gpslocationRepository.findOne({ where: { id } });;
  }

  async update(id: number, address: GPSLocation): Promise<GPSLocation> {
    await this.gpslocationRepository.update(id, address);
    return this.gpslocationRepository.findOne({ where: { id } });;
  }

  async remove(id: number): Promise<boolean> {
    await this.gpslocationRepository.delete(id);
    const isDeleted = !(await this.gpslocationRepository.findOne({ where: { id } }));
    if (isDeleted) {
      return true;
    } else {
      return false;
    }
  }
}
