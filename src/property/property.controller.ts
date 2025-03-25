import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFiles } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
// POST ~/property
  @Post()
  @UseInterceptors(
   FilesInterceptor('files'),
  )
  createProperty(@Body() createPropertyDto: CreatePropertyDto,@UploadedFiles() files: Express.Multer.File[],) {
    return this.propertyService.createProperty(createPropertyDto,files);
  }
  @Post(':id/uploadFiles')
  @UseInterceptors(
   FilesInterceptor('files'),
  )
  uploadPropertyFiles(@Param('id') id:number,@UploadedFiles() files: Express.Multer.File[],) {
    return this.propertyService.uploadPropertyFiles(id,files);
  }

  @Get()
  findAllProperties() {
    return this.propertyService.findAllProperties();
  }

  @Get(':id/files')
  findPropertyFiles(@Param('id') id:number) {
    return this.propertyService.findPropertyFiles(id);
  }

  @Get(':id')
  findOneProperty(@Param('id') id: string) {
    return this.propertyService.findOneProperty(+id);
  }

  @Patch(':id')
  updateProperty(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertyService.updateProperty(+id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.removeProperty(+id);
  }
  @Delete(':id/deleteFiles')
  async deletePropertyFiles(@Param('id') id:number,@Body('filesIds') filesIds: number[]) {
    return this.propertyService.deletePropertyFiles(id,filesIds);
  }
}
