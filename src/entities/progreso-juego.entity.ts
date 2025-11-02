import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Juego } from './juego.entity';

@Entity('progreso_juegos')
export class ProgresoJuego {
  @PrimaryGeneratedColumn()
  id_progreso: number;

  @Column()
  id_usuario: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column()
  id_juego: number;

  @ManyToOne(() => Juego, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_juego' })
  juego: Juego;

  @Column({ type: 'int', default: 0 })
  puntuacion_total: number;

  @Column({ type: 'int', default: 0 })
  partidas_jugadas: number;

  @Column({ type: 'int', default: 0 })
  partidas_completadas: number;

  @Column({ type: 'int', default: 0 })
  mejor_puntuacion: number;

  @Column({ type: 'int', default: 0 })
  total_aciertos: number;

  @Column({ type: 'int', default: 0 })
  total_errores: number;

  @Column({ type: 'varchar', length: 20, default: 'principiante' })
  nivel_actual: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}