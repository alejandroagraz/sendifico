import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import {ConfigService} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [PokemonService, ConfigService],
  exports: [PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule {}
