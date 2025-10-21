import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Palabra } from './palabra.entity';

@Entity('lecciones')
export class Leccion {
  @PrimaryGeneratedColumn()
  id_leccion: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  id_usuario: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.lecciones)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @CreateDateColumn()
  fecha_publicacion: Date;

  @ManyToMany(() => Palabra, (palabra) => palabra.lecciones)
  @JoinTable({
    name: 'leccion_palabra',
    joinColumn: { name: 'id_leccion', referencedColumnName: 'id_leccion' },
    inverseJoinColumn: { name: 'id_palabra', referencedColumnName: 'id_palabra' }
  })
  palabras: Palabra[];
}