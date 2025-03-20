import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateNeighborhoodDto {
  @IsString({ message: 'Neighborhood name must be a string' })
  @IsNotEmpty({ message: 'Neighborhood name cannot be empty' })
  @Length(4, 50, {
    message: 'Neighborhood name must be between 4 and 50 characters',
  })
  neighborhood_name: string;

  @IsNumber({}, { message: 'City ID must be a number' })
  @IsNotEmpty({ message: 'City ID cannot be empty' })
  city_id: number;
}