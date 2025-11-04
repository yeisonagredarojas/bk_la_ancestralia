import { IsInt, IsString, IsOptional, IsIn } from 'class-validator';

export class CreatePartidaDto {
  @IsInt()
  id_juego: number;

  @IsOptional()
  @IsInt()
  id_leccion?: number;

  @IsString()
  @IsIn(['facil', 'medio', 'dificil'])
  nivel_dificultad: string;
}