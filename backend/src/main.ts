import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Carga variables de entorno
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Habilitar CORS correctamente
  app.enableCors({
    origin: 'http://localhost:5173', // sin barra final
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,               // permite cookies si las usas
  });

  // Validaciones globales para DTOs
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true,              
      forbidNonWhitelisted: true,   
      transform: true,              
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api`);
}

bootstrap();
