import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PalabrasService } from './palabras.service';
import { PalabrasController } from './palabras.controller';
import { Palabra } from '../entities/palabra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Palabra])],
  controllers: [PalabrasController],
  providers: [PalabrasService],
})
export class PalabrasModule {}