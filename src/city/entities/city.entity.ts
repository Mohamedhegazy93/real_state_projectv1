import { Neighborhood } from '../../neighborhood/entities/neighborhood.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
  } from 'typeorm';

  @Entity()
  export class City {
    @PrimaryGeneratedColumn()
    city_id: number;
  
    @Column({ nullable: false, unique: true,length:20 })
    city_name: string;

    @OneToMany(() => Neighborhood, (neighborhood) => neighborhood.city)
  neighborhoods: Neighborhood[];

  
  }
  