import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "../module/users/users.module";
import {AuthModule} from "../module/auth/auth.module";
import {BusinessOnboardModule} from "../module/business_onboard/business_onboard.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',        // Your MySQL host
      port: 3306,               // MySQL default port
      username: 'root',         // DB username
      password: 'Root$12345',     // DB password
      database: 'retail',       // Database name
      // entities: [ProductEntity],
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    BusinessOnboardModule
  ],
})
export class AppModule {}
