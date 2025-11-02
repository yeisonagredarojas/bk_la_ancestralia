import { IsInt, IsBoolean, IsOptional, IsObject, Min } from 'class-validator';

export class FinalizarPartidaDto {
  @IsInt()
  @Min(0)
  puntuacion: number;

  @IsInt()
  @Min(0)
  aciertos: number;

  @IsInt()
  @Min(0)
  errores: number;

  @IsInt()
  @Min(0)
  tiempo_segundos: number;

  @IsBoolean()
  completado: boolean;

  @IsOptional()
  @IsObject()
  detalles?: any;
}