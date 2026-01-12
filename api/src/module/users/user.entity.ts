import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Double,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {Role} from "../../models/roles.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  // Unique employee identifier
  @Column({ nullable: true }) @ApiProperty() userNumber: string;

  @Column() @ApiProperty() username: string;
  @Column() @ApiProperty() password: string;

  // Personal Information
  @Column() @ApiProperty() firstName: string;
  @Column() @ApiProperty() lastName: string;
  @Column({ nullable: true }) @ApiProperty() gender: string;
  @Column() @ApiProperty() dateOfBirth: string;
  @Column({ nullable: true }) @ApiProperty() maritalStatus: string;
  @Column({ nullable: true }) @ApiProperty() nationality: string;

  // Additional Information
  @Column() @ApiProperty() mobile: string;
  @Column() @ApiProperty() mail: string;
  @Column({ nullable: true }) @ApiProperty() altMobile: string;
  @Column({ nullable: true }) @ApiProperty() whatsApp: string;

  // Others
  @Column({ nullable: true }) @ApiProperty() trainingPeriod: number;
  @Column({ nullable: true }) @ApiProperty() terminationPeriod: number;
  @Column({ nullable: true }) @ApiProperty() remark: string;
  @Column({ nullable: true }) @ApiProperty() status: boolean;
  @Column({ nullable: true }) @ApiProperty() notes: string;

  // Employment Information
  @Column({ nullable: true }) @ApiProperty() jobTitle: string;
  @Column({ nullable: true }) @ApiProperty() salary: string;
  @Column({ nullable: true }) @ApiProperty() hireDate: Date;
  @Column({ nullable: true }) @ApiProperty() terminationDate: Date;

  @Column({ nullable: true }) @ApiProperty() address: string;
  @Column({ nullable: true }) @ApiProperty() city: string;
  @Column({ nullable: true }) @ApiProperty() state: string;
  @Column({ nullable: true }) @ApiProperty() country: string;
  @Column({ nullable: true }) @ApiProperty() pinCode: string;

  // Server Details
  @Column({ nullable: true }) @ApiProperty() created_date: Date;
  @Column({ nullable: true }) @ApiProperty() modified_date: Date;
  @Column({ nullable: true }) @ApiProperty() created_id: number;
  @Column({ nullable: true }) @ApiProperty() modified_id: number;

  // Company
  @Column() @ApiProperty() company_id: number;

  @ManyToOne(() => Role, (role) => role.users, { cascade: true, eager: true })
  @JoinTable()
  @ApiProperty()
  role: Role;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

}
