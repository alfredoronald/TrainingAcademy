import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanjeService } from './canje.service';
import { CanjeController } from './canje.controller';
import { Canje } from './canje.entity';
import { Recompensa } from '../recompensa/recompensa.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Puntos } from '../puntaje/puntaje.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Canje,
      Recompensa, 
      Usuario,
      Puntos
    ])
  ],
  controllers: [CanjeController],
  providers: [CanjeService],
  exports: [CanjeService]
})
export class CanjeModule {}