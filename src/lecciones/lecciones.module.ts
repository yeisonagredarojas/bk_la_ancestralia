import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeccionesService } from './lecciones.service';
import { LeccionesController } from './lecciones.controller';
import { Leccion } from '../entities/leccion.entity';
import { Palabra } from '../entities/palabra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leccion, Palabra])],
  controllers: [LeccionesController],
  providers: [LeccionesService],
})
export class LeccionesModule {}