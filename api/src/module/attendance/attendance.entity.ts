import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {Base} from "../../helper/base.entity";

@Entity()
export class Attendance extends Base{
    @PrimaryGeneratedColumn() @ApiProperty()  id: number | null;
    @Column({type: 'date'}) @ApiProperty()  date: Date;
    @Column() @ApiProperty()  checkInTime: string;
    @Column() @ApiProperty()  checkInLatLong: string;
    @Column() @ApiProperty()  checkOutTime: string;
    @Column() @ApiProperty()  checkOutLatLong: string;
    @Column({
        type: 'enum',
        enum: ['present', 'absent', 'leave'],
        default: 'absent',
    }) @ApiProperty()  attendanceStatus: string;
    @Column() @ApiProperty()  workHours: string;
    @Column({nullable : true}) @ApiProperty()  totalTravelKM: number;
    @Column({nullable : true}) @ApiProperty()  checkInPlaceName: string;
    @Column({nullable : true}) @ApiProperty()  checkInPlaceLocality: string;
    @Column({nullable : true}) @ApiProperty()  checkInPlaceAdminArea: string;
    @Column({nullable : true}) @ApiProperty()  checkInPlaceCountry: string;
    @Column({nullable : true}) @ApiProperty()  checkOutPlaceName: string;
    @Column({nullable : true}) @ApiProperty()  checkOutPlaceLocality: string;
    @Column({nullable : true}) @ApiProperty()  checkOutPlaceAdminArea: string;
    @Column({nullable : true}) @ApiProperty()  checkOutPlaceCountry: string;
    @Column() @ApiProperty()  userId: number;
}
