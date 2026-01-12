import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permissions.entity";
import { ApiProperty } from "@nestjs/swagger";
import {User} from "../module/users/user.entity";

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permissions) => permissions.roles, { cascade: true })
  @JoinTable()
  permissions: Permission[];
}
