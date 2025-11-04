import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Juego } from './juego.entity';
import { Leccion } from './leccion.entity';

@Entity('partidas')
export class Partida {
  @PrimaryGeneratedColumn()
  id_partida: number;

  @Column()
  id_usuario: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column()
  id_juego: number;

  @ManyToOne(() => Juego, (juego) => juego.partidas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_juego' })
  juego: Juego;

  @Column({ nullable: true })
  id_leccion: number;

  @ManyToOne(() => Leccion, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_leccion' })
  leccion: Leccion;

  @Column({ type: 'int', default: 0 })
  puntuacion: number;

  @Column({ type: 'int', default: 0 })
  aciertos: number;

  @Column({ type: 'int', default: 0 })
  errores: number;

  @Column({ type: 'int', default: 0 })
  tiempo_segundos: number;

  @Column({ type: 'json', nullable: true })
  detalles: any;

  @Column({ default: false })
  completado: boolean;

  @Column({ type: 'varchar', length: 20, default: 'facil' })
  nivel_dificultad: string;

  @CreateDateColumn()
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date;
}