import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from '../usuario/usuario.module';
import { Usuario } from '../usuario/usuario.entity';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // disponible en todos los módulos
    }),

    // Conexión a PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Usuario, __dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // crea tablas automáticamente (solo en desarrollo)
      autoLoadEntities: true,
    }),

    UsuarioModule,
  ],
})
export class DatabaseModule {}
