import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';

@Controller('neighborhood')
export class NeighborhoodController {
  constructor(private readonly neighborhoodService: NeighborhoodService) {}
  // POST : ~/neighborhood
  @Post()
  create(@Body() createNeighborhoodDto: CreateNeighborhoodDto) {
    return this.neighborhoodService.create(createNeighborhoodDto);
  }
  // GET : ~/neighborhood
  @Get()
  findAll() {
    return this.neighborhoodService.findAll();
  }
  // GET : ~/neighborhood/city_id/neighborhoods
  @Get(':city_id/neighborhoods')
  findNeighborhoodsOfCity(@Param('city_id', ParseIntPipe) city_id: string) {
    return this.neighborhoodService.findNeighborhoodsOfCity(+city_id);
  }
  // GET : ~/neighborhood/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.neighborhoodService.findOne(+id);
  }
  // UPDATE : ~/neighborhood/:id

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateNeighborhoodDto: UpdateNeighborhoodDto,
  ) {
    return this.neighborhoodService.update(+id, updateNeighborhoodDto);
  }
  // DELETE : ~/neighborhood/:id

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.neighborhoodService.remove(+id);
  }
}
