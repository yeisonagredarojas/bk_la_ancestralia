import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Palabra } from './palabra.entity';
import { Leccion } from './leccion.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  contraseña: string;

  @Column()
  id_rol: number;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @OneToMany(() => Palabra, (palabra) => palabra.usuario)
  palabras: Palabra[];

  @OneToMany(() => Leccion, (leccion) => leccion.usuario)
  lecciones: Leccion[];
}