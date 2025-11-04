import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

ConfigModule.forRoot();

const dataSourceCli = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_DATABASE || 'lengua_inga',

  entities: [join(__dirname, '/entities/*.{ts,js}')],
  migrations: [join(__dirname, '/migrations/*.{ts,js}')],

  synchronize: true,
  logging: true,
});

export default dataSourceCli;
