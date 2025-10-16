import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recompensa } from './recompensa.entity';
import { RecompensaService } from './recompensa.service';
import { RecompensaController } from './recompensa.controller';
import { Canje } from '../canje/canje.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recompensa, Canje])],
  providers: [RecompensaService],
  controllers: [RecompensaController],
})
export class RecompensaModule {}
