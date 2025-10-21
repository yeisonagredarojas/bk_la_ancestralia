import { IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateLeccionDto {
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  id_palabras?: number[];
}