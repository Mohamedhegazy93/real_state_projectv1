import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
// POST : ~/city
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }
// GET : ~/city
  @Get()
  findAll() {
    return this.cityService.findAll();
  }
// GET : ~/city/:id
  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: string) {
    return this.cityService.findOne(+id);
  }
// UPDATE : ~/city/:id
  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }
// DELETE : ~/city/:id
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: string) {
    return this.cityService.remove(+id);
  }
}
