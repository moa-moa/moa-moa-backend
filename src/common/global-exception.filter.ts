import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch() // ()를 공란으로 두어 모든 예외처리를 받을 수 있도록 하였다.
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        message = exception.message.replace(/\n/g, '');
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      }

      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = exception.message.replace(/\n/g, '');
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      }

      default: // default
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    response.status(status).json({
      statusCode: status,
      message: (exception as any).message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
