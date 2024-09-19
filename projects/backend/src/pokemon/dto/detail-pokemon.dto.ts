import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';
import {PokemonDto} from "./pokemon.dto";

class TypeDto {
  @ApiProperty({ description: 'slot', example: 1, type: 'number' })
  @IsNumber()
  lot: number;

  @ApiProperty({ description: 'type', type: [PokemonDto]})
  type: PokemonDto;
}

export class DetailPokemonDto {
  @ApiProperty({ description: 'name', example: 'charmander', type: 'string' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'types', type: [TypeDto] })
  types: TypeDto[];
}
