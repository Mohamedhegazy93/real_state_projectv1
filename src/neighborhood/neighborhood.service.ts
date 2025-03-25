import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighborhood } from './entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { City } from 'src/city/entities/city.entity';
import { NeighborhoodMedia } from 'src/media/entities/neighborhoodMedia.entity';
import { MediaType } from 'src/media/entities/media.entity';

@Injectable()
export class NeighborhoodService {
  constructor(
    @InjectRepository(Neighborhood)
    private readonly neighborhoodRepository: Repository<Neighborhood>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(NeighborhoodMedia)
    private readonly neighborhoodMediaRepository: Repository<NeighborhoodMedia>,
  ) {}

  async create(createNeighborhoodDto: CreateNeighborhoodDto) {
    const city = await this.cityRepository.findOne({
      where: { city_id: createNeighborhoodDto.city_id },
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }

    // Check Neighborhood exist
    const existingNeighborhood = await this.neighborhoodRepository.findOne({
      where: {
        neighborhood_name: createNeighborhoodDto.neighborhood_name,
        city: { city_id: createNeighborhoodDto.city_id },
      },
    });
    if (existingNeighborhood) {
      throw new BadRequestException('Neighborhood already exists in this city');
    }

    // Create Neighborhood
    const neighborhood = this.neighborhoodRepository.create({
      neighborhood_name: createNeighborhoodDto.neighborhood_name,
      city: city,
    });

    // Save
    await this.neighborhoodRepository.save(neighborhood);

    return {
      message: 'Neighborhood created successfully',
      neighborhood,
    };
  }

  async uploadNeighborhoodImages(id: number, files: Express.Multer.File[]) {
    const neigbohood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: id },
    });
    if (!neigbohood) {
      throw new NotFoundException('neighborhood not found');
    }
    if (files && files.length > 0) {
      const mediaPromises = files.map(async (file) => {
        const media = this.neighborhoodMediaRepository.create({
          media_type: file.mimetype.startsWith('image')
            ? MediaType.IMAGE
            : MediaType.VIDEO,
          media_url: file.filename,
          neighborhood: neigbohood,
        });
        await this.neighborhoodMediaRepository.save(media);
      });

      await Promise.all(mediaPromises);
      return {
        message: 'all files uploded successfully',
      };
    }
    throw new BadRequestException('no files provided');
  }

  async findAll() {
    const neighborhoods = await this.neighborhoodRepository.find({
      relations: ['city'],
    });
    if (!neighborhoods) throw new NotFoundException();
    return {
      length: neighborhoods.length,
      neighborhoods,
    };
  }
  // neigbohood/cityid/neighbohood
  async findNeighborhoodsOfCity(city_id: number) {
    const city = await this.cityRepository.findOne({
      where: { city_id: city_id },
    });
    if (!city) throw new NotFoundException('city not found');

    const neigbohoods = await this.neighborhoodRepository.find({
      where: { city: { city_id: city_id } },
    });
    if (!neigbohoods)
      throw new NotFoundException(
        `no neigbohoods founded in ${city.city_name} yet`,
      );
    return {
      length: neigbohoods.length,
      neigbohoods,
    };
  }

  async findOne(id: number) {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: id },
      relations: ['city'],
    });
    if (!neighborhood) throw new NotFoundException();
    return {
      neighborhood,
    };
  }

  async update(id: number, updateNeighborhoodDto: UpdateNeighborhoodDto) {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: id },
    });
    if (!neighborhood) throw new NotFoundException();

    if (updateNeighborhoodDto.city_id) {
      const city = await this.neighborhoodRepository.findOne({
        where: { city: { city_id: updateNeighborhoodDto.city_id } },
      });
      if (!city) throw new NotFoundException('city not found');
    }
    const existingNeighborhood = await this.neighborhoodRepository.findOne({
      where: {
        neighborhood_name: updateNeighborhoodDto.neighborhood_name,
        city: { city_id: updateNeighborhoodDto.city_id },
      },
    });

    if (existingNeighborhood && existingNeighborhood.neighborhood_id !== id) {
      throw new BadRequestException('Neighborhood already exists in this city');
    }

    if (updateNeighborhoodDto.neighborhood_name !== undefined) {
      neighborhood.neighborhood_name = updateNeighborhoodDto.neighborhood_name;
    }

    if (updateNeighborhoodDto.city_id !== undefined) {
      const city = await this.cityRepository.findOne({
        where: { city_id: updateNeighborhoodDto.city_id },
      });
      if (!city) {
        throw new NotFoundException('city not found');
      }
      neighborhood.city = city;
    }

    await this.neighborhoodRepository.save(neighborhood);

    return {
      messgae: 'neighborhood updated sucessfully',
      neighborhood,
    };
  }
  async remove(id: number) {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: id },
    });
    if (!neighborhood) throw new NotFoundException('neighborhood not found');
    try {
      await this.neighborhoodRepository.remove(neighborhood);
      return {
        message: 'neighborhood deleted sucessfully',
      };
    } catch (error) {
      if (error.message.includes('violates foreign key constraint')) {
        throw new BadRequestException(
          'can not delete this neighborhood because it has related property',
        );
      }
      throw error;
    }
  }
}
