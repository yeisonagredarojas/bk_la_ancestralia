import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leccion } from '../entities/leccion.entity';
import { Palabra } from '../entities/palabra.entity';
import { CreateLeccionDto } from '../dto/create-leccion.dto';

@Injectable()
export class LeccionesService {
  constructor(
    @InjectRepository(Leccion)
    private leccionRepository: Repository<Leccion>,
    @InjectRepository(Palabra)
    private palabraRepository: Repository<Palabra>,
  ) {}

  async create(createLeccionDto: CreateLeccionDto, id_usuario: number) {
    const palabras = createLeccionDto.id_palabras
      ? await this.palabraRepository.findByIds(createLeccionDto.id_palabras)
      : [];

    const leccion = this.leccionRepository.create({
      titulo: createLeccionDto.titulo,
      descripcion: createLeccionDto.descripcion,
      id_usuario,
      palabras,
    });

    return this.leccionRepository.save(leccion);
  }

  async findAll() {
    return this.leccionRepository.find({ 
      relations: ['usuario', 'palabras'] 
    });
  }

  async findOne(id: number) {
    const leccion = await this.leccionRepository.findOne({
      where: { id_leccion: id },
      relations: ['usuario', 'palabras'],
    });
    if (!leccion) throw new NotFoundException('Lección no encontrada');
    return leccion;
  }

  async update(id: number, updateDto: CreateLeccionDto, userId: number, userRole: string) {
    const leccion = await this.findOne(id);
    
    if (userRole !== 'Administrador' && leccion.id_usuario !== userId) {
      throw new ForbiddenException('No tienes permiso para editar esta lección');
    }

    if (updateDto.id_palabras) {
      leccion.palabras = await this.palabraRepository.findByIds(updateDto.id_palabras);
    }

    Object.assign(leccion, {
      titulo: updateDto.titulo,
      descripcion: updateDto.descripcion,
    });

    return this.leccionRepository.save(leccion);
  }

  async remove(id: number, userId: number, userRole: string) {
    const leccion = await this.findOne(id);
    
    if (userRole !== 'Administrador' && leccion.id_usuario !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta lección');
    }

    return this.leccionRepository.remove(leccion);
  }
}