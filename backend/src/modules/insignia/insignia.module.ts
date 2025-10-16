import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insignia } from './insignia.entity';
import { InsigniaService } from './insignia.service';
import { InsigniaController } from './insignia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Insignia])],
  providers: [InsigniaService],
  controllers: [InsigniaController],
})
export class InsigniaModule {}
