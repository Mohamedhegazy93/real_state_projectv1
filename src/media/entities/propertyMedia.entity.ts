import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from '../../property/entities/property.entity';

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
}

@Entity()
export class PropertyMedia {
    @PrimaryGeneratedColumn()
    media_id: number;

    @Column({
        type: 'enum',
        enum: MediaType,
        default: MediaType.IMAGE,
    })
    media_type: MediaType;

    @Column()
    media_url: string;

    @ManyToOne(() => Property, (property) => property.media)
    property: Property;
}

