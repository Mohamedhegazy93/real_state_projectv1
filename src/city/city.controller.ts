import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Query,
  ParseFilePipe,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  // POST : ~/city
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }
  // POST : ~/city/:id/uploadImages
  @Post(':id/uploadImages')
  @UseInterceptors(FilesInterceptor('files'))
  uploadCityImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.cityService.uploadCityImages(id, files);
  }
 // DELETE : ~/city/:id/deleteImages
  @Delete(':id/deleteImages')
  deleteCityImages(
    @Param('id', ParseIntPipe) id: number,
    @Body('filesIds') filesIds: number[],
  ) {
    return this.cityService.deleteCityImages(id, filesIds);
  }

  // GET : ~/city
  @Get()
  findAll(@Query('city_name') city_name?: string) {
    return this.cityService.findAll(city_name);
  }
  // GET : ~/city/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.findOne(id);
  }
  // UPDATE : ~/city/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.cityService.update(id, updateCityDto);
  }
  // DELETE : ~/city/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.remove(id);
  }
}
