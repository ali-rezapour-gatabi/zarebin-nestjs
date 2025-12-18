import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MainModule } from './main.module';
import { ExceptionTraceService } from '@app/exeption-trace';
import { GlobalExceptionTraceFilter } from '@app/exeption-trace/exeption-trace-global.filter';
import { BadRequestException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const exeptionTraceFilter = app.get(ExceptionTraceService);
  app.useGlobalFilters(new GlobalExceptionTraceFilter(exeptionTraceFilter));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use('/assets', express.static(join(process.cwd(), 'assets')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: process.env.NODE_ENV === 'production',

      exceptionFactory: (errors) => {
        const messages = errors.flatMap((error) => Object.values(error.constraints || {}));

        const merged = messages.join(' | ');

        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: merged,
          errors: errors.map((e) => ({
            property: e.property,
            constraints: e.constraints,
          })),
        });
      },
    }),
  );

  const config = new DocumentBuilder().build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env.PORT ?? 3002);
  Logger.log('Server is running on port 3002');
}

void bootstrap();
