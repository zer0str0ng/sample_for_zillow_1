import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    const errObj = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
      detail: message,
      path: request.url,
    };

    new Logger().error(JSON.stringify(errObj));

    response.status(status).json(errObj);
  }
}
