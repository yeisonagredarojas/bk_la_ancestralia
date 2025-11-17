import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'Juan Pérez', 
    description: 'Nombre completo del estudiante' 
  })
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ 
    example: 'estudiante@inga.com', 
    description: 'Email del estudiante' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'Contraseña del estudiante',
    minLength: 6
  })
  @IsNotEmpty()
  @MinLength(6)
  contraseña: string;
}