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
  INestApplication,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ExpressAdapter } from '@nestjs/platform-express';
// **** التعديل هنا: استيراد express كـ default import
import express from 'express'; // <--- تم التعديل هنا

const logger = new Logger('Bootstrap');

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

let cachedApp: INestApplication;

async function bootstrap() {
  if (!cachedApp) {
    // **** التعديل هنا: استخدام express() مباشرة لأنه تم استيراده كـ default import
    const expressApp = express(); // <--- تم التعديل هنا
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(helmet());
    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.use(cookieParser());

    const swagger = new DocumentBuilder()
      .setTitle('Nestjs-real-state-application')
      .addServer(process.env.NODE_ENV === 'production' 
        ? process.env.VERCEL_URL || 'https://real-state-project-nestjs.vercel.app'
        : 'http://localhost:3000')
      .setVersion('1.0')
      .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
      .addBearerAuth()
      .build();
    const documentation = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('swagger', app, documentation);

    // **** ملاحظة: لا حاجة لـ await app.init() هنا في بيئة Vercel Serverless Function
    // Vercel يتوقع RequestListener جاهزًا
    // هذا السطر يمكن أن يسبب مشاكل في بيئة Vercel
    // ولكن في بيئة التطوير المحلية، قد يكون مطلوبًا.
    // سنقوم بتجربة إزالته أولاً، وإذا فشل، نعيده ونفكر في حل آخر.
    // حالياً سأبقي عليه ولكن مع الأخذ في الاعتبار أنه قد يكون هو المشكلة.
    // await app.init(); // <--- هذا السطر قد يكون المشكلة في بيئة Vercel
    cachedApp = app;
  }
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  // التأكد من أن instance قادر على التعامل مع req, res
  // إذا كان app.init() يسبب مشاكل، فإن هذه النقطة هي التي ستتأثر.
  await app.listen(0); // <--- أضف هذا السطر لتهيئة الـ RequestListener بشكل صحيح
  return instance(req, res);
}

// هذا الجزء هو لتشغيل التطبيق محليًا
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL_ENV) {
  bootstrap().then(app => {
    const port = process.env.PORT || 3000;
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.listen(port, () => {
      logger.log(`Application is running on: http://localhost:${port}`);
    });
  });
}