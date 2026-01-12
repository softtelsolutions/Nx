import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) { }

  async create(comp: Company): Promise<Company> {
    const company = await this.companyRepository.create(comp);
    return this.companyRepository.save(company);
  }

  findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  findOne(id: number): Promise<Company> {
    return this.companyRepository.findOne({ where: { id } });;
  }

  async update(id: number, company: Company): Promise<Company> {
    await this.companyRepository.update(id, company);
    return this.companyRepository.findOne({ where: { id } });;
  }

  async remove(id: number): Promise<boolean> {
    await this.companyRepository.delete(id);
    const isDeleted = !(await this.companyRepository.findOne({ where: { id } }));
    if (isDeleted) {
      return true;
    } else {
      return false;
    }
  }
}
