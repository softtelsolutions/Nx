import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {
  }

  async create(att: Attendance): Promise<Attendance> {
    try {
      let attendance: Attendance;
      attendance = this.attendanceRepository.create(att);
      return await this.attendanceRepository.save(attendance);
    } catch (e) {
      console.log('Error is ' + e.message);
    }
  }

  findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find();
  }

  findOne(id: number): Promise<Attendance> {
    return this.attendanceRepository.findOne({ where: { id } });
  }

  async update(id: number, attendance: Attendance): Promise<Attendance> {
    await this.attendanceRepository.update(id, attendance);
    return await this.attendanceRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<boolean> {
    await this.attendanceRepository.delete(id);
    return !(await this.attendanceRepository.findOne({ where: { id } }));
  }

  findAllByEmployee(id: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({ where: { userId: id } });
  }

  async findByEmployeeAndDate(id: number, selectedDate: Date) {
    return await this.attendanceRepository.find({ where: { userId: id, date: selectedDate }, order: { id: 'DESC' } });
  }

  async findAllByDate(selectedDate: Date) {
    return await this.attendanceRepository.findBy({ date: selectedDate });
  }

  // Get present employees
  async findPresentEmployees(date?: Date): Promise<Attendance[]> {
    return this.findEmployeesByStatus('present', date);
  }

  // Get absent employees
  async findAbsentEmployees(date?: Date): Promise<Attendance[]> {
    return this.findEmployeesByStatus('absent', date);
  }

  // Get employees on leave
  async findLeaveEmployees(date?: Date): Promise<Attendance[]> {
    return this.findEmployeesByStatus('leave', date);
  }

  // Generic method to find by status
  private async findEmployeesByStatus(status: string, date?: Date): Promise<Attendance[]> {
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.attendanceStatus = :status', { status });

    if (date) {
      query.andWhere('attendance.date = :date', { date });
    }

    return query.getMany();
  }

  // Get all attendance status counts for dashboard
  async getAttendanceSummary(date?: Date): Promise<{
    present: number;
    absent: number;
    leave: number;
  }> {
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('attendance.attendanceStatus', 'status')
      .addSelect('COUNT(*)', 'count');

    if (date) {
      query.where('attendance.date = :date', { date });
    }

    query.groupBy('attendance.attendanceStatus');

    const results = await query.getRawMany();

    // Initialize counts
    const summary = {
      present: 0,
      absent: 0,
      leave: 0,
    };

    // Map results to summary
    results.forEach((result) => {
      summary[result.status] = parseInt(result.count, 10);
    });

    return summary;
  }
}
