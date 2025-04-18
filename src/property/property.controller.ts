import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  // POST ~/property
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  createProperty(@Body() createPropertyDto: CreatePropertyDto, @Req() req) {
    return this.propertyService.createProperty(createPropertyDto, req.user);
  }
  // POST ~/property/:id/uploadFiles
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post(':id/uploadFiles')
  @UseInterceptors(FilesInterceptor('files'))
  uploadPropertyFiles(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.propertyService.uploadPropertyFiles(id, files);
  }
  // GET ~/property

  @Get()
  findAllProperties() {
    return this.propertyService.findAllProperties();
  }
  // POST ~/property/:id/files
  @Get(':id/files')
  findPropertyFiles(@Param('id') id: number) {
    return this.propertyService.findPropertyFiles(id);
  }
  // POST ~/property/:id
  @Get(':id')
  findOneProperty(@Param('id') id: string) {
    return this.propertyService.findOneProperty(+id);
  }
  // PATCH ~/property/:id

  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.updateProperty(+id, updatePropertyDto);
  }
  // DELETE ~/property/:id
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  removeProperty(@Param('id') id: number, @Req() req) {
    return this.propertyService.removeProperty(id, req.user);
  }
  // DELETE ~/property/:id/deleteFiles
  @UseGuards(AuthGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id/deleteFiles')
  async deletePropertyFiles(
    @Param('id') id: number,
    @Body('filesIds') filesIds: number[],
  ) {
    return this.propertyService.deletePropertyFiles(id, filesIds);
  }
}
