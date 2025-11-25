import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateOracionDto {
  @IsString()
  texto_espanol: string;

  @IsString()
  texto_ingles: string;

  @IsString()
  texto_inga: string;

  @IsString()
  palabra_clave_inga: string;

  @IsString()
  palabra_clave_espanol: string;

  @IsString()
  palabra_clave_ingles: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  categoria_ingles?: string;

  @IsString()
  @IsIn(['facil', 'medio', 'dificil'])
  nivel_dificultad: string;
}