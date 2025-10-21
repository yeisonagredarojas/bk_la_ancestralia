import { IsEmail, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

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
  @IsNotEmpty()
  id_rol: number;
}