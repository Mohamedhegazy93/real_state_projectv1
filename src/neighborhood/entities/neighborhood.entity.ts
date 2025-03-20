import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { City } from '../../city/entities/city.entity';
import { Property } from 'src/property/entities/property.entity';

@Entity()
export class Neighborhood {
  @PrimaryGeneratedColumn()
  neighborhood_id: number;

  @Column({nullable:false,length:50})
  neighborhood_name: string;

  @ManyToOne(() => City, (city) => city.neighborhoods,{onDelete:'RESTRICT'})
  @JoinColumn({ name: 'city_id' })
  city: City;
  @OneToMany(() => Property, (property) => property.neighborhood,{onDelete:'RESTRICT'})
  properties: Property[];

 
}