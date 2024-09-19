import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PokemonDto {
  @ApiProperty({ description: 'name', example: 'charmander', type: 'string' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'url',
    example: 'https://pokeapi.co/api/v2/pokemon/4/',
    type: 'string'
  })
  @IsString()
  readonly url: string;
}
