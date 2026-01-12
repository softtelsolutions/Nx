import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  
  @Catch()
  export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const responseData = {
        statusCode: status,
        message:
          status === HttpStatus.INTERNAL_SERVER_ERROR
            ? 'Internal server error'
            : exception.message || null,
        data: exception.response || {}, // Add additional response data here
      };
  
      response.status(status).json(responseData);
    }
  }
  