"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const logger = new common_1.Logger('Bootstrap');
class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal Server Error';
        logger.error(`[${request.method}] ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`, exception.stack);
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'object' ? message.message : message,
        });
    }
}
exports.GlobalExceptionFilter = GlobalExceptionFilter;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.use(cookieParser());
    const swagger = new swagger_1.DocumentBuilder()
        .setTitle('Nestjs-real-state-application')
        .addServer('http://localhost:3000')
        .setVersion('1.0')
        .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
        .addBearerAuth()
        .build();
    const documentation = swagger_1.SwaggerModule.createDocument(app, swagger);
    swagger_1.SwaggerModule.setup('swagger', app, documentation);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map