import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreatePartidaDto } from '../dto/create-partida.dto';
import { FinalizarPartidaDto } from '../dto/finalizar-partida.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateOracionDto } from '../dto/create-oracion.dto';
import { Roles } from '../auth/roles.decorator';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAllJuegos() {
    return this.gamesService.findAllJuegos();
  }

  @Get('juego/:id')
  findOneJuego(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOneJuego(id);
  }

  @Post('partida')
  crearPartida(
    @Body() createPartidaDto: CreatePartidaDto,
    @CurrentUser() user: any,
  ) {
    return this.gamesService.crearPartida(createPartidaDto, user.id_usuario);
  }


  // Obtener palabras con idioma
  @Get('palabras')
  obtenerPalabrasParaJuego(
    @Query('id_leccion') id_leccion?: string,
    @Query('cantidad') cantidad?: string,
    @Query('idioma') idioma?: string,
  ) {
    const idLeccionNum = id_leccion ? parseInt(id_leccion, 10) : undefined;
    const cantidadNum = cantidad ? parseInt(cantidad, 10) : 6;
    return this.gamesService.obtenerPalabrasParaJuego(idLeccionNum, cantidadNum, idioma || 'es');
  }


  @Patch('partida/:id/finalizar')
  finalizarPartida(
    @Param('id', ParseIntPipe) id: number,
    @Body() finalizarDto: FinalizarPartidaDto,
    @CurrentUser() user: any,
  ) {
    console.log('🎯 Finalizando partida:', {
      id,
      userId: user.id_usuario,
      dto: finalizarDto,
    });
    
    return this.gamesService.finalizarPartida(id, finalizarDto, user.id_usuario)
      .then(result => {
        console.log('✅ Partida finalizada correctamente');
        return result;
      })
      .catch(error => {
        console.error('❌ Error al finalizar partida:', error);
        throw error;
      });
  }

  @Get('progreso')
  obtenerProgreso(
    @CurrentUser() user: any,
    @Query('id_juego') id_juego?: string,
  ) {
    const idJuegoNum = id_juego ? parseInt(id_juego, 10) : undefined;
    return this.gamesService.obtenerProgreso(user.id_usuario, idJuegoNum);
  }

  @Get('historial')
  obtenerHistorialPartidas(
    @CurrentUser() user: any,
    @Query('id_juego') id_juego?: string,
  ) {
    const idJuegoNum = id_juego ? parseInt(id_juego, 10) : undefined;
    return this.gamesService.obtenerHistorialPartidas(user.id_usuario, idJuegoNum);
  }

  @Get('ranking/:id_juego')
  obtenerRanking(
    @Param('id_juego', ParseIntPipe) id_juego: number,
    @Query('limite') limite?: string,
  ) {
    const limiteNum = limite ? parseInt(limite, 10) : 10;
    return this.gamesService.obtenerRanking(id_juego, limiteNum);
  }



  // Obtener categorías disponibles
  @Get('categorias')
  obtenerCategorias(@Query('idioma') idioma?: string) {
    return this.gamesService.obtenerCategorias(idioma || 'es');
  }


  // Obtener palabras por categoría para juego de imágenes

  @Get('palabras-categoria/:categoria')
  obtenerPalabrasPorCategoria(
    @Param('categoria') categoria: string,
    @Query('cantidad') cantidad?: string,
    @Query('solo_con_imagen') soloConImagen?: string,
    @Query('idioma') idioma?: string, // ← AGREGAR ESTO
  ) {
    const cantidadNum = cantidad ? parseInt(cantidad, 10) : 6;
    const soloImagen = soloConImagen === 'true';
    return this.gamesService.obtenerPalabrasPorCategoria(
      categoria,
      cantidadNum,
      soloImagen,
      idioma || 'es', // ← PASARLO AL SERVICE
    );
  }



  // Obtener oraciones con idioma
  @Get('oraciones')
  obtenerOracionesParaJuego(
    @Query('nivel_dificultad') nivelDificultad?: string,
    @Query('cantidad') cantidad?: string,
    @Query('idioma') idioma?: string,
  ) {
    const nivel = nivelDificultad || 'medio';
    const cantidadNum = cantidad ? parseInt(cantidad, 10) : 6;
    return this.gamesService.obtenerOracionesParaJuego(nivel, cantidadNum, idioma || 'es');
  }

  @Post('oraciones')
  @UseGuards(JwtAuthGuard)
  @Roles('Administrador')
  crearOracion(
    @Body() dto: CreateOracionDto,
    @CurrentUser() user: any,
  ) {
    return this.gamesService.crearOracion(dto, user.id_usuario);
  }
  @Delete('oraciones/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('Administrador')
  eliminarOracion(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.gamesService.eliminarOracion(id, user.id_usuario, user.rol);
  }

  @Get('games')
  obtenerJuegos(@Query('idioma') idioma?: string) {
    return this.gamesService.obtenerJuegos(idioma || 'es');
  }
}