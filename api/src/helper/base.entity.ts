import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class Base{
    @Column({nullable : true}) @ApiProperty() private created_date: Date;
    @Column({nullable : true}) @ApiProperty() private modified_date: Date;
    @Column({nullable : true}) @ApiProperty() private created_id: number;
    @Column({nullable : true}) @ApiProperty() private modified_id: number;
    @Column({nullable : true}) @ApiProperty() private company_id: number;
    @Column({nullable : true}) @ApiProperty() private status: boolean;
}