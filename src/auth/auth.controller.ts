
// Actualizar src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { CreateUsuarioDto } from 'src/dto/create-usuario.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register-admin')
  async registerAdmin(@Body() body: CreateUsuarioDto) {
    body.id_rol = 1; // fuerza que sea Administrador
    return this.authService.register(body);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo estudiante' })
  @ApiResponse({ status: 201, description: 'Estudiante registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Email ya existe' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}