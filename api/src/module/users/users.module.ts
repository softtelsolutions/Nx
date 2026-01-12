import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Role} from "../../models/roles.entity";
import {Permission} from "../../models/permissions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]),],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
