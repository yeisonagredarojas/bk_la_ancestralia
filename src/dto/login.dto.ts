// Actualizar src/dto/login.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'admin@inga.com', 
    description: 'Email del usuario' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'admin123', 
    description: 'Contraseña del usuario',
    minLength: 6
  })
  @IsNotEmpty()
  @MinLength(6)
  contraseña: string;
}
