import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, ManyToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Leccion } from './leccion.entity';

// @Entity('palabras')
// export class Palabra {
//   @PrimaryGeneratedColumn()
//   id_palabra: number;

//   @Column()
//   palabra_inga: string;

//   @Column()
//   traduccion_espanol: string;

//   @Column({ nullable: true })
//   categoria: string;

//   @Column({ nullable: true })
//   audio: string;

//   @Column({ nullable: true })
//   imagen: string;

//   @Column()
//   id_usuario: number;

//   @ManyToOne(() => Usuario, (usuario) => usuario.palabras)
//   @JoinColumn({ name: 'id_usuario' })
//   usuario: Usuario;

//   @CreateDateColumn()
//   fecha_creacion: Date;

//   @ManyToMany(() => Leccion, (leccion) => leccion.palabras)
//   lecciones: Leccion[];
// }
@Entity('palabras')
export class Palabra {
  @PrimaryGeneratedColumn()
  id_palabra: number;

  @Column()
  palabra_inga: string;

  @Column()
  traduccion_espanol: string;

  @Column({ nullable: true })
  traduccion_ingles: string;  // ← AGREGAR

  @Column({ nullable: true })
  categoria: string;

  @Column({ nullable: true })
  categoria_ingles: string;  // ← AGREGAR

  @Column({ nullable: true })
  audio: string;

  @Column({ nullable: true })
  imagen: string;

  @Column()
  id_usuario: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.palabras)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToMany(() => Leccion, (leccion) => leccion.palabras)
  lecciones: Leccion[];
}