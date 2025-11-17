import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email },
      relations: ['rol'],
    });

    if (!usuario || !(await bcrypt.compare(loginDto.contraseña, usuario.contraseña))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      sub: usuario.id_usuario, 
      email: usuario.email, 
      rol: usuario.rol.nombre_rol 
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol.nombre_rol,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usuarioRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.contraseña, 10);
    const usuario = this.usuarioRepository.create({
      nombre: registerDto.nombre,
      email: registerDto.email,
      contraseña: hashedPassword,
      id_rol: 3, // Rol de Estudiante
      estado: true,
    });

    await this.usuarioRepository.save(usuario);

    return {
      message: 'Usuario registrado exitosamente',
      email: usuario.email,
    };
  }

  // ✅ Aquí va registerAdmin DENTRO de la clase
  async registerAdmin(createDto: CreateUsuarioDto) {
    const existingUser = await this.usuarioRepository.findOne({
      where: { email: createDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createDto.contraseña, 10);
    const usuario = this.usuarioRepository.create({
      nombre: createDto.nombre,
      email: createDto.email,
      contraseña: hashedPassword,
      id_rol: createDto.id_rol, // 1 para admin
      estado: true,
    });

    await this.usuarioRepository.save(usuario);

    return {
      message: 'Administrador registrado exitosamente',
      email: usuario.email,
    };
  }
}
