import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
// POST : ~/city
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }
  @Post(':id/uploadImages')
  @UseInterceptors(
    FilesInterceptor('files'),
   )
  uploadCityImages(@Param('id')id:number,@UploadedFiles() files:Express.Multer.File[]) {
    return this.cityService.uploadCityImages(id,files);
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
