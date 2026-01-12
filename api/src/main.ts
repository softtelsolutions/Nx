/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {Logger, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {getGlobalPrefix} from "@nestjs/swagger/dist/utils/get-global-prefix";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User Registration System API')
    .setDescription('API for user registration and authentication with role-based access control')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger_api', app, document);

  const port = process.env.PORT || 3003;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:3003`);
  console.log(`Swagger UI is available on: http://localhost:3003/swagger_api`);
}

bootstrap();
