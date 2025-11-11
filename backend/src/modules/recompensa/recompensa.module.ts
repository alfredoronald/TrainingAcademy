import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecompensaService } from './recompensa.service';
import { RecompensaController } from './recompensa.controller';
import { Recompensa } from './recompensa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recompensa])],
  controllers: [RecompensaController],
  providers: [RecompensaService],
  exports: [RecompensaService],
})
export class RecompensaModule {}