import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, UpdateDateColumn, Timestamp, CreateDateColumn } from 'typeorm';
import { Neighborhood } from '../../neighborhood/entities/neighborhood.entity';
import { User } from '../../user/entities/user.entity';
import { Media } from 'src/media/entities/media.entity';

export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
}

export enum PropertyType {
  APARTMENT = 'apartment',
  VILLA = 'villa',
  LAND = 'land',
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  property_id: number;

  @Column({nullable:false,})
  title: string;

  @Column()
  description: string;

  @Column({type:'decimal',nullable:true})
  price: number;

  @Column({type:'float',nullable:false})
  area: number;

  @Column({type:'int',nullable:true})
  rooms: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @Column({
    type: 'enum',
    enum: PropertyType,
    default: PropertyType.APARTMENT,
  })
  property_type: PropertyType;
  @CreateDateColumn() 
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.properties,{eager:true})
  neighborhood: Neighborhood;

  @ManyToOne(() => User, (user) => user.properties)
  user: User;

  @OneToMany(() => Media, (media) => media.property,{eager:true})
  media: Media[];



}