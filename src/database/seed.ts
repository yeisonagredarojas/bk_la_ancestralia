import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
  type: 'postgres',
  // host: 'localhost',
  // host: '127.0.0.1',
  host: 'postgres',
  port: 5432,
  username: 'admin',
  password: 'admin123',
  database: 'lengua_inga',
  entities: ['src/entities/*.entity.ts'],
  // synchronize: false,
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  // Insertar Roles
  await AppDataSource.query(`
    INSERT INTO roles (nombre_rol, descripcion) VALUES
    ('Administrador', 'Acceso total al sistema'),
    ('Profesor', 'Puede crear y gestionar contenido'),
    ('Estudiante', 'Solo puede visualizar contenido')
    ON CONFLICT (nombre_rol) DO NOTHING;
  `);

  // Insertar Usuario Administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await AppDataSource.query(`
    INSERT INTO usuarios (nombre, email, contraseña, id_rol, estado)
    VALUES ('Administrador', 'admin@inga.com', '${hashedPassword}', 1, true)
    ON CONFLICT (email) DO NOTHING;
  `);

  // Insertar Usuario Profesor de prueba
  const profPassword = await bcrypt.hash('profesor123', 10);
  await AppDataSource.query(`
    INSERT INTO usuarios (nombre, email, contraseña, id_rol, estado)
    VALUES ('Profesor Demo', 'profesor@inga.com', '${profPassword}', 2, true)
    ON CONFLICT (email) DO NOTHING;
  `);

  console.log('✅ Datos iniciales insertados correctamente');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Error al insertar datos:', error);
  process.exit(1);
});