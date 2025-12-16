import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionTraceService } from './exeption-trace.service';

@Catch()
export class GlobalExceptionTraceFilter implements ExceptionFilter {
  constructor(private readonly traceService: ExceptionTraceService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let stack: string | undefined = undefined;
    let type = 'UnknownError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      stack = exception.stack;
      type = exception.constructor.name;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
      type = exception.constructor.name;
    }

    await this.traceService.save({
      method: request.method,
      path: request.url,
      status,
      type,
      message,
      stack,
      context: {
        body: request.body as unknown,
        params: request.params,
        query: request.query,
        headers: request.headers,
      },
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
