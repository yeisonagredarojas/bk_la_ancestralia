import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Partida } from './partida.entity';

@Entity('juegos')
export class Juego {
  @PrimaryGeneratedColumn()
  id_juego: number;

  @Column({ unique: true})
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  tipo_juego: string; // 'emparejar', 'completar_frase', 'pronunciacion'

  @Column({ type: 'json', nullable: true })
  configuracion: any; // Configuraciones específicas del juego

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @OneToMany(() => Partida, (partida) => partida.juego)
  partidas: Partida[];
}