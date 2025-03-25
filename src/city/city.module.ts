import { BadRequestException, Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Media } from 'src/media/entities/media.entity';
import { CityMedia } from 'src/media/entities/cityMedia.entity';

@Module({
  imports:[TypeOrmModule.forFeature([City,Media,CityMedia]),
  MulterModule.register({
    storage: diskStorage({
      destination: './images/city',
      filename: (req, file, cb) => {
        const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
        const filename = `${prefix}-${file.originalname}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype.startsWith('image')
    
      ) {
        cb(null, true);
      } else {
        cb(new BadRequestException('unsupported file format'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }),

],
  
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
