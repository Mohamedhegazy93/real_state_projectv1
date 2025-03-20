import { Module } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighborhood } from './entities/neighborhood.entity';
import { City } from 'src/city/entities/city.entity';
import { CityModule } from 'src/city/city.module';

@Module({
  imports:[TypeOrmModule.forFeature([Neighborhood,City]),CityModule],
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService],
})
export class NeighborhoodModule {}
