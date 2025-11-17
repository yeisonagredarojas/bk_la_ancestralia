import { IsEmail, IsNotEmpty, MinLength, IsNumber,IsOptional  } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  contraseña: string;

  @IsNumber()
  //@IsNotEmpty()
  @IsOptional()
  id_rol: number;
}