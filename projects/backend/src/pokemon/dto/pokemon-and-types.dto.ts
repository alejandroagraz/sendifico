import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

class LanguageDto {
  @ApiProperty({ description: 'name', example: 'es', type: 'string' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'url',
    example: 'https://pokeapi.co/api/v2/language/7/',
    type: 'string'
  })
  @IsString()
  readonly url: string;
}

class NamesDto {
  @ApiProperty({ description: 'language', type: LanguageDto})
  language: LanguageDto;

  @ApiProperty({ description: 'name', example: 'Planta', type: 'string' })
  @IsString()
  name: string;
}

class TypDto {
  @ApiProperty({ description: 'name', example: 'poison', type: 'string' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'url',
    example: 'https://pokeapi.co/api/v2/type/4/',
    type: 'string'
  })
  @IsString()
  readonly url: string;
}

class TypesDto {
  @ApiProperty({ description: 'slot', example: 1, type: 'number' })
  @IsNumber()
  lot: number;

  @ApiProperty({ description: 'type', type: TypDto})
  type: TypDto;

  @ApiProperty({ description: 'error', type: [NamesDto]})
  names: NamesDto[];
}

export class PokemonAndTypesDto {
  @ApiProperty({ description: 'name', example: 'charmander', type: 'string' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'types', type: [TypesDto] })
  types: TypesDto[];
}
