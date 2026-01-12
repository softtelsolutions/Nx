import { ApiProperty } from "@nestjs/swagger";
import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";
import {Base} from "../../helper/base.entity";

@Entity()
export class GPSLocation extends Base{
    @PrimaryGeneratedColumn() @ApiProperty()  id: number;
    @Column() @ApiProperty()  date: Date;
    @Column() @ApiProperty()  locationTime: string;
    @Column() @ApiProperty()  latitude: string;
    @Column() @ApiProperty()  longitude: string;
    @Column() @ApiProperty()  user_id: number;
    @Column() @ApiProperty()  placeName: string;
    @Column() @ApiProperty()  placeLocality: string;
    @Column() @ApiProperty()  placeAdminArea: string;
    @Column() @ApiProperty()  placeCountry: string;
}
