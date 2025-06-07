"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
let HttpLoggerMiddleware = class HttpLoggerMiddleware {
    logger = new common_1.Logger('HTTP');
    use(request, response, next) {
        const { method, originalUrl, ip } = request;
        const userAgent = request.get('user-agent') || '';
        const startTime = Date.now();
        const user = request.user;
        console.log('Request User Object in Middleware:', user);
        const userId = user ? user.id : 'Guest';
        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            const processingTime = Date.now() - startTime;
            this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - User ID: ${userId} - IP: ${ip} - User-Agent: ${userAgent} - Time: ${processingTime}ms`);
        });
        next();
    }
};
exports.HttpLoggerMiddleware = HttpLoggerMiddleware;
exports.HttpLoggerMiddleware = HttpLoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], HttpLoggerMiddleware);
//# sourceMappingURL=http-logger.middleware.js.map