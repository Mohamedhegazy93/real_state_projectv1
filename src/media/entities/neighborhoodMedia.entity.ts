import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { City } from '../../city/entities/city.entity';
import { MediaType } from './media.entity';
import { Neighborhood } from 'src/neighborhood/entities/neighborhood.entity';

@Entity()
export class NeighborhoodMedia { 
    @PrimaryGeneratedColumn()
    neighborhooda_id: number;

    @Column({
        type: 'enum',
        enum: MediaType,
        default: MediaType.IMAGE,
    })
    media_type: MediaType;

    @Column()
    media_url: string;

    @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.media)
    neighborhood: Neighborhood;
}