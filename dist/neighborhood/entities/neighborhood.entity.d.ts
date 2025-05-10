import { City } from '../../city/entities/city.entity';
import { Property } from 'src/property/entities/property.entity';
import { Media } from 'src/media/entities/media.entity';
export declare class Neighborhood {
    neighborhood_id: number;
    neighborhood_name: string;
    city: City;
    properties: Property[];
    media: Media[];
}
