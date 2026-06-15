import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';  // ← CORREGIR
import { Repository, DataSource } from 'typeorm';  // ← CORREGIR
import { Juego } from '../entities/juego.entity';
import { Partida } from '../entities/partida.entity';
import { ProgresoJuego } from '../entities/progreso-juego.entity';
import { Palabra } from '../entities/palabra.entity';
import { Leccion } from '../entities/leccion.entity';
import { CreatePartidaDto } from '../dto/create-partida.dto';
import { FinalizarPartidaDto } from '../dto/finalizar-partida.dto';
import { CreateOracionDto } from '../dto/create-oracion.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Juego)
    private juegoRepository: Repository<Juego>,
    @InjectRepository(Partida)
    private partidaRepository: Repository<Partida>,
    @InjectRepository(ProgresoJuego)
    private progresoRepository: Repository<ProgresoJuego>,
    @InjectRepository(Palabra)
    private palabraRepository: Repository<Palabra>,
    @InjectRepository(Leccion)
    private leccionRepository: Repository<Leccion>,
    @InjectDataSource()  // ← CAMBIAR de InjectConnection a InjectDataSource
    private dataSource: DataSource,  // ← CAMBIAR de Connection a DataSource
  ) {}

  // Obtener todos los juegos disponibles
  async findAllJuegos() {
    return this.juegoRepository.find({ where: { activo: true } });
  }

  // Obtener un juego específico
  async findOneJuego(id: number) {
    const juego = await this.juegoRepository.findOne({
      where: { id_juego: id, activo: true },
    });
    if (!juego) throw new NotFoundException('Juego no encontrado');
    return juego;
  }

  // Crear una nueva partida
  async crearPartida(createPartidaDto: CreatePartidaDto, id_usuario: number) {
    const juego = await this.findOneJuego(createPartidaDto.id_juego);

    // Verificar que la lección existe si se proporciona
    if (createPartidaDto.id_leccion) {
      const leccion = await this.leccionRepository.findOne({
        where: { id_leccion: createPartidaDto.id_leccion },
      });
      if (!leccion) throw new NotFoundException('Lección no encontrada');
    }

    const partida = this.partidaRepository.create({
      id_usuario,
      id_juego: createPartidaDto.id_juego,
      id_leccion: createPartidaDto.id_leccion,
      nivel_dificultad: createPartidaDto.nivel_dificultad,
    });

    return this.partidaRepository.save(partida);
  }

  // Obtener palabras para el juego de emparejar
  async obtenerPalabrasParaJuego(
    id_leccion?: number,
    cantidad: number = 6,
    idioma: string = 'es',
  ) {
    let palabras: Palabra[];

    if (id_leccion) {
      // Si viene una lección, obtener solo sus palabras
      const leccion = await this.leccionRepository.findOne({
        where: { id_leccion },
        relations: ['palabras'],
      });

      if (!leccion) {
        throw new NotFoundException('Lección no encontrada');
      }

      palabras = leccion.palabras;
    } else {
      // Palabras aleatorias a nivel global
      palabras = await this.palabraRepository
        .createQueryBuilder('palabra')
        .orderBy('RANDOM()')
        .limit(cantidad * 2) // Más variedad
        .getMany();
    }

    // Verificación de cantidad mínima
    if (!palabras || palabras.length < cantidad) {
      throw new BadRequestException(
        `No hay suficientes palabras disponibles. Se requieren al menos ${cantidad}`,
      );
    }

    // Selección final
    const palabrasSeleccionadas = this.shuffleArray(palabras).slice(0, cantidad);

    return palabrasSeleccionadas.map((palabra) => ({
      id_palabra: palabra.id_palabra,
      palabra_inga: palabra.palabra_inga,

      /* ⭐ Integración con idiomas (del primer método) */
      traduccion:
        idioma === 'en'
          ? palabra.traduccion_ingles || palabra.traduccion_espanol
          : palabra.traduccion_espanol,

      traduccion_espanol: palabra.traduccion_espanol,
      traduccion_ingles: palabra.traduccion_ingles,

      /* ⭐ Integración de categorías multilenguaje */
      categoria:
        // idioma === 'en' ? palabra.categoria_ingles : palabra.categoria,
        idioma === 'en'
          ? palabra.categoria_ingles || palabra.categoria
          : palabra.categoria,

      imagen: palabra.imagen,
      audio: palabra.audio,
    }));

  }

  



  async finalizarPartida(
    id_partida: number,
    finalizarDto: FinalizarPartidaDto,
    id_usuario: number,
  ) {
    try {
      const partida = await this.partidaRepository.findOne({
        where: { id_partida, id_usuario },
        relations: ['juego'],
      });

      if (!partida) {
        throw new NotFoundException('Partida no encontrada o no pertenece al usuario');
      }

      // Actualizar la partida
      partida.puntuacion = finalizarDto.puntuacion;
      partida.aciertos = finalizarDto.aciertos;
      partida.errores = finalizarDto.errores;
      partida.tiempo_segundos = finalizarDto.tiempo_segundos;
      partida.completado = finalizarDto.completado;
      partida.detalles = finalizarDto.detalles;
      partida.fecha_fin = new Date();

      await this.partidaRepository.save(partida);

      // Actualizar el progreso del jugador
      try {
        await this.actualizarProgreso(id_usuario, partida.id_juego, finalizarDto);
      } catch (progresoError) {
        console.error('Error al actualizar progreso:', progresoError);
        // No fallar toda la operación si el progreso falla
      }

      return {
        mensaje: 'Partida finalizada con éxito',
        partida,
      };
    } catch (error) {
      console.error('Error en finalizarPartida:', error);
      throw error;
    }
  }


  private async actualizarProgreso(
    id_usuario: number,
    id_juego: number,
    resultado: FinalizarPartidaDto,
  ) {
    try {
      let progreso = await this.progresoRepository.findOne({
        where: { id_usuario, id_juego },
      });

      if (!progreso) {
        // Crear nuevo progreso si no existe
        progreso = this.progresoRepository.create({
          id_usuario,
          id_juego,
          puntuacion_total: 0,
          partidas_jugadas: 0,
          partidas_completadas: 0,
          mejor_puntuacion: 0,
          total_aciertos: 0,
          total_errores: 0,
          nivel_actual: 'principiante',
        });
      }

      // Actualizar valores
      progreso.puntuacion_total += resultado.puntuacion;
      progreso.partidas_jugadas += 1;
      progreso.total_aciertos += resultado.aciertos;
      progreso.total_errores += resultado.errores;

      if (resultado.completado) {
        progreso.partidas_completadas += 1;
      }

      if (resultado.puntuacion > progreso.mejor_puntuacion) {
        progreso.mejor_puntuacion = resultado.puntuacion;
      }

      // Calcular nivel basado en puntuación total
      progreso.nivel_actual = this.calcularNivel(progreso.puntuacion_total);

      await this.progresoRepository.save(progreso);
      
      return progreso;
    } catch (error) {
      console.error('Error en actualizarProgreso:', error);
      throw error;
    }
  }

  // Obtener el progreso de un usuario en un juego
  async obtenerProgreso(id_usuario: number, id_juego?: number) {
    if (id_juego) {
      const progreso = await this.progresoRepository.findOne({
        where: { id_usuario, id_juego },
        relations: ['juego'],
      });
      return progreso || null;
    }

    // Obtener todo el progreso del usuario
    return this.progresoRepository.find({
      where: { id_usuario },
      relations: ['juego'],
    });
  }

  // Obtener historial de partidas
  async obtenerHistorialPartidas(id_usuario: number, id_juego?: number) {
    const where: any = { id_usuario };
    if (id_juego) {
      where.id_juego = id_juego;
    }

    return this.partidaRepository.find({
      where,
      relations: ['juego', 'leccion'],
      order: { fecha_inicio: 'DESC' },
      take: 20, // Últimas 20 partidas
    });
  }

  // Obtener ranking de jugadores
  async obtenerRanking(id_juego: number, limite: number = 10) {
    return this.progresoRepository.find({
      where: { id_juego },
      relations: ['usuario'],
      order: { puntuacion_total: 'DESC' },
      take: limite,
    });
  }

  // Funciones auxiliares
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private calcularNivel(puntuacion_total: number): string {
    if (puntuacion_total < 100) return 'principiante';
    if (puntuacion_total < 500) return 'intermedio';
    if (puntuacion_total < 1000) return 'avanzado';
    return 'experto';
  }

  // Obtener categorías disponibles
  async obtenerCategorias(idioma: string = 'es') {
    const campo = idioma === 'en' ? 'categoria_ingles' : 'categoria';
    const categorias = await this.palabraRepository
      .createQueryBuilder('palabra')
      .select(`palabra.${campo}`, 'categoria')
      .distinct(true)
      .where(`palabra.${campo} IS NOT NULL`)
      .orderBy(`palabra.${campo}`, 'ASC')
      .getRawMany();

    return categorias.map(c => c.categoria);
  }

  async obtenerPalabrasPorCategoria(
    categoria: string,
    cantidad: number = 6,
    soloConImagen: boolean = false,
    idioma: string = 'es',
  ) {
    // const queryBuilder = this.palabraRepository
    //   .createQueryBuilder('palabra')
    //   .where('palabra.categoria = :categoria', { categoria });

    // dentro de obtenerPalabrasPorCategoria(categoria, cantidad, soloConImagen, idioma)
    const queryBuilder = this.palabraRepository
      .createQueryBuilder('palabra')
      .where('(palabra.categoria = :categoria OR palabra.categoria_ingles = :categoria)', { categoria });


    if (soloConImagen) {
      queryBuilder.andWhere('palabra.imagen IS NOT NULL');
      queryBuilder.andWhere("palabra.imagen != ''");
    }

    const palabras = await queryBuilder
      .orderBy('RANDOM()')
      .limit(cantidad * 2) // Más palabras para tener opciones
      .getMany();

    if (palabras.length < cantidad) {
      throw new BadRequestException(
        `No hay suficientes palabras en la categoría "${categoria}". Se requieren al menos ${cantidad}`,
      );
    }

    // Separar palabras con imagen (correctas) y sin imagen (distractores)
    const palabrasConImagen = palabras.filter(p => p.imagen && p.imagen.trim() !== '');
    
    // ← AGREGAR ESTA VALIDACIÓN
    if (palabrasConImagen.length === 0) {
      throw new BadRequestException(
        `No hay palabras con imágenes en la categoría "${categoria}". Por favor, agrega imágenes a las palabras.`,
      );
    }

    // Asegurarse de no pedir más palabras de las disponibles
    const cantidadReal = Math.min(cantidad, palabrasConImagen.length);
    const palabrasJuego = this.shuffleArray(palabrasConImagen).slice(0, cantidadReal);
    
    // Para cada palabra correcta, agregar 2-3 distractores
    const resultado = palabrasJuego.map(palabraCorrecta => {
      const distractores = this.shuffleArray(
        palabras.filter(p => p.id_palabra !== palabraCorrecta.id_palabra)
      ).slice(0, 3);

      const opciones = this.shuffleArray([palabraCorrecta, ...distractores]);

      return {
        imagen: palabraCorrecta.imagen,
        palabra_correcta: palabraCorrecta.palabra_inga,
        id_palabra_correcta: palabraCorrecta.id_palabra,
        traduccion_correcta: idioma === 'en'  // ← AGREGAR ESTA LÍNEA
          ? (palabraCorrecta.traduccion_ingles || palabraCorrecta.traduccion_espanol)
          : palabraCorrecta.traduccion_espanol,
        opciones: opciones.map(o => ({
          id_palabra: o.id_palabra,
          palabra_inga: o.palabra_inga,
          traduccion_espanol: o.traduccion_espanol,
          traduccion: idioma === 'en'
            ? (o.traduccion_ingles || o.traduccion_espanol)
            : o.traduccion_espanol,

        })),
        // categoria: palabraCorrecta.categoria,
        categoria: idioma === 'en'
          ? (palabraCorrecta.categoria_ingles || palabraCorrecta.categoria)
          : palabraCorrecta.categoria,
      };
    });

    return resultado;
  }

  // Obtener oraciones para el juego de completar frases
  async obtenerOracionesParaJuego(
    nivel_dificultad: string = 'medio',
    cantidad: number = 6,
    idioma: string = 'es',
  ) {
    const oraciones = await this.dataSource.query(
      `SELECT * FROM oraciones 
      WHERE nivel_dificultad = $1 
      ORDER BY RANDOM() 
      LIMIT $2`,
      [nivel_dificultad, cantidad]
    );

    if (oraciones.length < cantidad) {
      throw new BadRequestException('No hay suficientes oraciones');
    }

    const resultado = await Promise.all(
      oraciones.map(async (oracion) => {
        const palabrasSimilares = await this.palabraRepository
          .createQueryBuilder('palabra')
          .where('palabra.palabra_inga != :palabraClave', {
            palabraClave: oracion.palabra_clave_inga,
          })
          .orderBy('RANDOM()')
          .limit(3)
          .getMany();

        const opciones = this.shuffleArray([
          {
            palabra_inga: oracion.palabra_clave_inga,
            traduccion_espanol: oracion.palabra_clave_espanol,
            traduccion_ingles: oracion.palabra_clave_ingles,
            traduccion: idioma === 'en' ? oracion.palabra_clave_ingles : oracion.palabra_clave_espanol,
            es_correcta: true,
          },
          ...palabrasSimilares.map(p => ({
            palabra_inga: p.palabra_inga,
            traduccion_espanol: p.traduccion_espanol,
            traduccion_ingles: p.traduccion_ingles,
            traduccion: idioma === 'en' ? p.traduccion_ingles : p.traduccion_espanol,
            es_correcta: false,
          })),
        ]);

        const textoOriginal = idioma === 'en' ? oracion.texto_ingles : oracion.texto_espanol;
        const palabraClave = idioma === 'en' ? oracion.palabra_clave_ingles : oracion.palabra_clave_espanol;
        const textoConHueco = textoOriginal.replace(new RegExp(palabraClave, 'i'), '_____');

        return {
          id_oracion: oracion.id_oracion,
          texto: textoConHueco,
          texto_completo_espanol: textoOriginal,
          texto_inga: oracion.texto_inga,
          palabra_correcta: oracion.palabra_clave_inga,
          palabra_correcta_traduccion: palabraClave,
          opciones: opciones,
          categoria: idioma === 'en' ? oracion.categoria_ingles : oracion.categoria,
        };
      })
    );

    return resultado;
  }

  async crearOracion(dto: CreateOracionDto, id_usuario: number) {
    const oracion = await this.dataSource.query(
      `INSERT INTO oraciones 
      (texto_espanol, texto_ingles, texto_inga, palabra_clave_inga, 
        palabra_clave_espanol, palabra_clave_ingles, categoria, categoria_ingles,
        nivel_dificultad, id_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        dto.texto_espanol,
        dto.texto_ingles,
        dto.texto_inga,
        dto.palabra_clave_inga,
        dto.palabra_clave_espanol,
        dto.palabra_clave_ingles,
        dto.categoria,
        dto.categoria_ingles,
        dto.nivel_dificultad,
        id_usuario,
      ]
    );
    return oracion[0];
  }
  async eliminarOracion(id: number, id_usuario: number, rol: string) {
    if (rol !== 'Administrador') {
      throw new Error('Solo un Administrador puede eliminar oraciones');
    }

    const resultado = await this.dataSource.query(
      `DELETE FROM oraciones WHERE id = $1 RETURNING *`,
      [id]
    );

    if (resultado.length === 0) {
      throw new Error('Oración no encontrada');
    }

    return {
      message: 'Oración eliminada correctamente',
      eliminada: resultado[0],
    };
  
  }

  async obtenerJuegos(idioma: string = 'es') {
    const juegos = await this.juegoRepository.find({ where: { activo: true } });

    return juegos.map(juego => ({
      id_juego: juego.id_juego,
      nombre: idioma === 'en' ? juego.nombre_ingles : juego.nombre,
      descripcion: idioma === 'en' ? juego.descripcion_ingles : juego.descripcion,
      tipo_juego: juego.tipo_juego,
      configuracion: juego.configuracion,
      activo: juego.activo,
      fecha_creacion: juego.fecha_creacion,
    }));
  }


}