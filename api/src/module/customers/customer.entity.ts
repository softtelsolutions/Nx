import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {CustomExceptionFilter} from "../../filter/custom-exception.filter";
import {Base} from "../../helper/base.entity";

@Entity()
@UseFilters(CustomExceptionFilter)
export class Customer extends Base{
    @PrimaryGeneratedColumn() @ApiProperty()  id: number;
    @Column({ type: 'enum', enum: ['Dealer', 'Distributor', 'Farmer'] }) @ApiProperty()  clientType: string;
    @Column() @ApiProperty()  businessName: string;
    @Column() @ApiProperty()  contactPersonName: string;
    @Column() @ApiProperty()  phoneNo: string;
    @Column() @ApiProperty()  mail: string;
    @Column() @ApiProperty()  industryType: string;
    @Column() @ApiProperty()  gstNo: string;
    @Column() @ApiProperty()  businessRegNo: string;
    @Column() @ApiProperty()  annualTurnover: string;
    @Column() @ApiProperty()  note: string;
    @Column() @ApiProperty()  remark: string;
    @Column() @ApiProperty()  latLongPosition: string;
    @Column() @ApiProperty()  assignedSalesmanId: number;
    @Column() @ApiProperty()  userId: number;

    @Column({ nullable: true }) @ApiProperty() address: string;
    @Column({ nullable: true }) @ApiProperty() city: string;
    @Column({ nullable: true }) @ApiProperty() state: string;
    @Column({ nullable: true }) @ApiProperty() country: string;
    @Column({ nullable: true }) @ApiProperty() pinCode: string;
}
