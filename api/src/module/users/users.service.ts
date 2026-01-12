import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {Role} from "../../models/roles.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) { }

  async create(ur: User): Promise<User> {
    try{
      ur.role = await this.roleRepository.findOne({
        where: { name: ur.role.name },
      });
      const user = this.userRepository.create(ur);
      return this.userRepository.save(user);
    }catch (e) {
      return e.message;
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAllByRole(name: string): Promise<User[]> {
    const role = await this.roleRepository.findOne({
      where: { name: name },
    });

    return await this.userRepository.find({
      where: {role: role},
      // relations: ['roles', 'roles.permissions'],
    });
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByMobile(mobile: string): Promise<User> {
    return this.userRepository.findOne({ where: { mobile } });
  }

  findOneByName(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, user: User): Promise<User> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });;
  }

  async remove(id: number): Promise<boolean> {
    await this.userRepository.delete(id);
    const isDeleted = !(await this.userRepository.findOne({ where: { id } }));
    if (isDeleted) {
      return true;
    } else {
      return false;
    }
  }
}
