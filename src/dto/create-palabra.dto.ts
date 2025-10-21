import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePalabraDto {
  @ApiProperty({ 
    example: 'Allpa', 
    description: 'Palabra en lengua Inga' 
  })
  @IsNotEmpty()
  palabra_inga: string;

  @ApiProperty({ 
    example: 'Tierra', 
    description: 'Traducción al español' 
  })
  @IsNotEmpty()
  traduccion_espanol: string;

  @ApiPropertyOptional({ 
    example: 'Naturaleza', 
    description: 'Categoría de la palabra' 
  })
  @IsOptional()
  categoria?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/audio.mp3', 
    description: 'URL del audio' 
  })
  @IsOptional()
  audio?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/imagen.jpg', 
    description: 'URL de la imagen' 
  })
  @IsOptional()
  imagen?: string;
}