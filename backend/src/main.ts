import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permitir solicitudes desde el frontend (HTML/Tailwind)
  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
