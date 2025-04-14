import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { CityModule } from './city/city.module';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { PropertyModule } from './property/property.module';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv'; 
import { UploadsModule } from './uploads/uploads.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
dotenv.config(); 


@Module({
  imports: [
    MulterModule.register({ dest: './images' }),
    CloudinaryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile:true
      
    }),
    UploadsModule,
    UserModule,
    CityModule,
    NeighborhoodModule,
    PropertyModule,
    MediaModule,
    CloudinaryModule,
    AuthModule,
    
    
  ],
  controllers: [AppController],
  providers: [AppService,
  
  {
    provide:APP_INTERCEPTOR,
    useClass:ClassSerializerInterceptor  //Exclude()
  },


],
})
export class AppModule {}
