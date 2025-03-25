import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { Media, MediaType } from 'src/media/entities/media.entity';
import { CityMedia } from 'src/media/entities/cityMedia.entity';
import { join } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(CityMedia)
    private cityMediaRepository: Repository<CityMedia>,
  ) {}

  // Create city
  async create(createCityDto: CreateCityDto) {
    const cityFind = await this.cityRepository.findOneBy({
      city_name: createCityDto.city_name,
    });
    if (cityFind) throw new BadRequestException('city already exist');

    const city = this.cityRepository.create(createCityDto);
    await this.cityRepository.save(city);

    return {
      message: 'city created sucessfully',
      city,
    };
  }

  async uploadCityImages(
   id: number,
    files: Express.Multer.File[],
  ) {
    const city = await this.cityRepository.findOne({ where: { city_id: id } });
    if (!city) {
      throw new NotFoundException('city not found');
    }
    if(files&&files.length>0){
      const cityPromises=files.map(async(file)=>{
        const media=await this.cityMediaRepository.create({
          media_type:MediaType.IMAGE,
          media_url:file.filename,
          city:city

        })
        await this.cityMediaRepository.save(media)
      })
      await Promise.all(cityPromises)
      return{message:'all images uploded sucessfully'}

    }
    throw new NotFoundException('no imags provided')
  }
  async deleteCityImages(id:number,filesIds:number[]){
    const city = await this.cityRepository.findOne({
      where: { city_id: id },
    });
    if (!city) {
      throw new NotFoundException('city not found');
    }
    for(const fileId of filesIds){
      const media=await this.cityMediaRepository.findOne({
        where:{media_id:fileId,city:{city_id:id}}
      })
      if(!media){
        throw new NotFoundException(
          `file with id ${fileId} not found for property ${id}`,
        );
      }
      const imagePath = join(
        process.cwd(),
        `./images/city/${media?.media_url}`,
      );
      unlinkSync(imagePath);
    }

    await this.cityMediaRepository.delete(filesIds);
    return {
      message: 'media deleted successfully',
    };
    }

  

  async findAll() {
    const cities = await this.cityRepository.find();
    return {
      length: cities.length,
      cities,
    };
  }

  async findOne(id: number) {
    const city = await this.cityRepository.findOne({ where: { city_id: id } });
    if (!city) throw new NotFoundException();
    return {
      city,
    };
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.cityRepository.findOne({ where: { city_id: id } });
    if (!city) throw new NotFoundException();
    const existCity = await this.cityRepository.findOne({
      where: { city_name: updateCityDto.city_name },
    });
    if (existCity && existCity.city_id !== id) {
      throw new BadRequestException('city already exist');
    }
    this.cityRepository.merge(city, updateCityDto);
    await this.cityRepository.save(city);

    return {
      message: 'city updated sucessfully',
      city,
    };
  }

  async remove(id: number) {
    const city = await this.cityRepository.findOne({ where: { city_id: id } });
    if (!city) throw new NotFoundException();
    try {
      await this.cityRepository.remove(city);
      return {
        message: 'city deleted sucessfully',
      };
    } catch (error) {
      if (error.message.includes('violates foreign key constraint')) {
        throw new BadRequestException(
          'can not delete this city because it has related neighborhoods',
        );
      }
      throw error;
    }
  }
}
