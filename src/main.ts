// Imports
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response } from 'express';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

// Logger
const logger = new Logger('Bootstrap');

// Global Exception Filter
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`,
      exception.stack,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'object' ? (message as any).message : message,
    });
  }
}

let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    
    // configurs
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(helmet());
    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.use(cookieParser());

    //Swagger Docs
    const swagger = new DocumentBuilder()
      .setTitle('Nestjs-real-state-application')
      .addServer(process.env.NODE_ENV === 'production' 
        ? 'https://real-state-project-nestjs.vercel.app'
        : 'http://localhost:3000')
      .setVersion('1.0')
      .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
      .addBearerAuth()
      .build();
    const documentation = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('swagger', app, documentation);

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// Export for serverless
export default async function handler(req, res) {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}
