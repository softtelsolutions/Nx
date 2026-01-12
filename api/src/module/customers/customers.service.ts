import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {
  }

  create(cust: Customer): Promise<Customer> {
    const customer = this.customerRepository.create(cust);
    return this.customerRepository.save(customer);
  }

  async findAll() {
    return await this.customerRepository.find();
  }

  async findBySalesmanId(id: number) {
    return await this.customerRepository.findBy({ userId: id });
  }

  async findByTypes(types: string[]): Promise<Customer[]> {
    return this.customerRepository.findBy(
      {
        clientType: In(types)
      },
    );
  }

  async findByTypesAndSalesman(types: string[], id: number): Promise<Customer[]> {
    return this.customerRepository.findBy(
      {
        clientType: In(types),
        userId: id
      },
    );
  }

  findOne(id: number): Promise<Customer> {
    return this.customerRepository.findOne({ where: { id } });
    ;
  }


  findOneByName(businessName: string): Promise<Customer | undefined> {
    return this.customerRepository.findOne({ where: { businessName } });
  }

  async update(id: number, customer: Customer): Promise<Customer> {
    await this.customerRepository.update(id, customer);
    return this.customerRepository.findOne({ where: { id } });
    ;
  }

  async remove(id: number): Promise<boolean> {
    await this.customerRepository.delete(id);
    const isDeleted = !(await this.customerRepository.findOne({ where: { id } }));
    if (isDeleted) {
      return true;
    } else {
      return false;
    }
  }
}
