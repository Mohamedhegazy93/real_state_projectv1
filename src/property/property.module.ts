import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { User } from 'src/user/entities/user.entity';
import { Neighborhood } from 'src/neighborhood/entities/neighborhood.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Property,User,Neighborhood])],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
