import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Palabra } from '../entities/palabra.entity';
import { CreatePalabraDto } from '../dto/create-palabra.dto';

@Injectable()
export class PalabrasService {
  constructor(
    @InjectRepository(Palabra)
    private palabraRepository: Repository<Palabra>,
  ) {}

  async create(createPalabraDto: CreatePalabraDto, id_usuario: number) {
    const palabra = this.palabraRepository.create({
      ...createPalabraDto,
      id_usuario,
    });
    return this.palabraRepository.save(palabra);
  }

  async findAll() {
    return this.palabraRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number) {
    const palabra = await this.palabraRepository.findOne({
      where: { id_palabra: id },
      relations: ['usuario'],
    });
    if (!palabra) throw new NotFoundException('Palabra no encontrada');
    return palabra;
  }

  async update(id: number, updateDto: CreatePalabraDto, userId: number, userRole: string) {
    const palabra = await this.findOne(id);
    
    if (userRole !== 'Administrador' && palabra.id_usuario !== userId) {
      throw new ForbiddenException('No tienes permiso para editar esta palabra');
    }

    Object.assign(palabra, updateDto);
    return this.palabraRepository.save(palabra);
  }

  async remove(id: number, userId: number, userRole: string) {
    const palabra = await this.findOne(id);
    
    if (userRole !== 'Administrador' && palabra.id_usuario !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta palabra');
    }

    return this.palabraRepository.remove(palabra);
  }
}