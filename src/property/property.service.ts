import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Neighborhood } from 'src/neighborhood/entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Neighborhood)
    private neighborhoodRepository: Repository<Neighborhood>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const { neighborhood_id, user_id, ...propertyData } = createPropertyDto;

    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: neighborhood_id },
    });
    if (!neighborhood) {
      throw new NotFoundException(
        `Neighborhood with ID ${neighborhood_id} not found`,
      );
    }
    const user = await this.userRepository.findOneBy({ id: user_id });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const propertyExist = await this.propertyRepository.findOne({
      where: {
        title: createPropertyDto.title,
        neighborhood: { neighborhood_id: createPropertyDto.neighborhood_id },
      },
    });
    if (propertyExist) {
      throw new BadGatewayException(
        'property already exist in this neighborhood according to his title , please change title',
      );
    }

    const property = this.propertyRepository.create({
      ...propertyData,
      neighborhood,
      user,
    });
    await this.propertyRepository.save(property);

    return {
      message: 'property created sucessfully',
      property,
    };
  }

  async findAll() {
    const propertys = await this.propertyRepository.find();
    if(!propertys){
      throw new NotFoundException('no propertys founded in this neighborhood')
    }
    return propertys;
  }

 async findOne(id: number) {
   const property = await this.propertyRepository.findOne({where:{property_id:id}})
   if(!property){
    throw new NotFoundException("property not found")
   }

   return{
    property
   }
  }

 async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.propertyRepository.findOneBy({ property_id: id });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // التحقق من وجود الحي والمستخدم إذا تم تحديثهما
    if (updatePropertyDto.neighborhood_id) {
      const neighborhood = await this.neighborhoodRepository.findOneBy({ neighborhood_id: updatePropertyDto.neighborhood_id });
      if (!neighborhood) {
        throw new NotFoundException(`Neighborhood with ID ${updatePropertyDto.neighborhood_id} not found`);
      }
      property.neighborhood = neighborhood;
    }

    if (updatePropertyDto.user_id) {
      const user = await this.userRepository.findOneBy({ id: updatePropertyDto.user_id });
      if (!user) {
        throw new NotFoundException(`User with ID ${updatePropertyDto.user_id} not found`);
      }
      property.user = user;
    }

    // تحديث خصائص العقار الأخرى
    Object.assign(property, updatePropertyDto);

    // حفظ التغييرات في قاعدة البيانات
    return this.propertyRepository.save(property);
  
  }

  async remove(id: number) {
    const property = await this.propertyRepository.findOne({
      where: { property_id: id },
    });
    if (!property) throw new NotFoundException('neighborhood not found');
    await this.propertyRepository.remove(property);

    return {
      message: 'property deleted sucessfully',
    };
  }
}
