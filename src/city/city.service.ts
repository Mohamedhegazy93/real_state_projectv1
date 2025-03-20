import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}
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
