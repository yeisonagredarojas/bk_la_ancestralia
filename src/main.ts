import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 🟢 Import Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🟢 Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Lengua Inga API')
    .setDescription('Documentación interactiva de la API del sistema Lengua Inga')
    .setVersion('1.0')
    .addBearerAuth() // Para probar endpoints con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS para Flutter
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Puerto del servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📘 Swagger disponible en http://localhost:${port}/api`);
  console.log(`📱 Listo para conectar con Flutter`);
}
bootstrap();
