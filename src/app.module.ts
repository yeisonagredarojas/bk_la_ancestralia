import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PalabrasModule } from './palabras/palabras.module';
import { LeccionesModule } from './lecciones/lecciones.module';


// 👇 importa el controlador y servicio principales
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ¡Solo en desarrollo! Cambiar a false en producción
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsuariosModule,
    RolesModule,
    PalabrasModule,
    LeccionesModule,
  ],
  // 👇 agrega aquí
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}