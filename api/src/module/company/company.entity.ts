import { ApiProperty } from '@nestjs/swagger';
import { Column, Double, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn() @ApiProperty() id: number;
  @Column() @ApiProperty() companyName: string;
  @Column({ nullable: true }) @ApiProperty() legalEntityType: string;

  //Contact Details
  @Column({ nullable: true }) @ApiProperty() address: string;
  @Column({ nullable: true }) @ApiProperty() city: string;
  @Column({ nullable: true }) @ApiProperty() country: string;
  @Column({ nullable: true }) @ApiProperty() state: string;
  @Column() @ApiProperty() pincode: string;

  @Column() @ApiProperty() phoneNo: string;
  @Column() @ApiProperty() email: string;
  @Column({ nullable: true }) @ApiProperty() website: string;

  //Financial Details
  @Column({ nullable: true }) @ApiProperty() openingBalance: string;
  @Column({ nullable: true }) @ApiProperty() closingBalance: string;
  @Column({ nullable: true }) @ApiProperty() gstNo: string;
  @Column({ nullable: true }) @ApiProperty() bankName: string;
  @Column({ nullable: true }) @ApiProperty() bankAccountNo: string;
  @Column({ nullable: true }) @ApiProperty() bankBranch: string;
  @Column({ nullable: true }) @ApiProperty() bankIFSCCode: string;

  // Operational Details;
  @Column({ nullable: true }) @ApiProperty() financialYearStart: Date;
  @Column({ nullable: true }) @ApiProperty() financialYearEnd: Date;
  @Column({ nullable: true }) @ApiProperty() currency: string;
  @Column({ nullable: true }) @ApiProperty() defaultLanguage: string;

  // Compliance Details
  @Column({ nullable: true }) @ApiProperty() businessRegistrationNo: string;
  @Column({ nullable: true }) @ApiProperty() licenseNo: string;
  @Column({ nullable: true }) @ApiProperty() complianceCertificate: string;

  // Additional Info
  @Column({ nullable: true }) @ApiProperty() primaryContactName: string;
  @Column({ nullable: true }) @ApiProperty() primaryContactEmail: string;
  @Column({ nullable: true }) @ApiProperty() primaryContactPhone: string;

  @Column({ nullable: true }) @ApiProperty() created_date: Date;
  @Column({ nullable: true }) @ApiProperty() modified_date: Date;
  @Column({ nullable: true }) @ApiProperty() created_id: number;
  @Column({ nullable: true }) @ApiProperty() modified_id: number;
  @Column({ nullable: true }) @ApiProperty() status: boolean;
}
