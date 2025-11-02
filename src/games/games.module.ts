import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Juego } from '../entities/juego.entity';
import { Partida } from '../entities/partida.entity';
import { ProgresoJuego } from '../entities/progreso-juego.entity';
import { Palabra } from '../entities/palabra.entity';
import { Leccion } from '../entities/leccion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Juego,
      Partida,
      ProgresoJuego,
      Palabra,
      Leccion,
    ]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}