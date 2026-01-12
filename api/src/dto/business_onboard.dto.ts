import { ApiProperty } from "@nestjs/swagger";
import {Company} from "../module/company/company.entity";
import {User} from "../module/users/user.entity";

export class BusinessOnboardDTO{
    @ApiProperty()
company: Company;
@ApiProperty()
user: User;
}
