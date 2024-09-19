import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PageDto } from '../common/dtos/page.dto';
import { ApiPaginatedResponse } from '../common/dtos/api-pagination-response';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PokemonAndTypesDto } from './dto/pokemon-and-types.dto';
import { DetailPokemonDto } from './dto/detail-pokemon.dto';
import { PokemonService } from './pokemon.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import {PokemonDto} from "./dto/pokemon.dto";

@ApiTags('Pokemons')
@ApiBearerAuth('token')
@Controller('pokemons')
@UseGuards(ThrottlerGuard)
export class PokemonController {
  constructor(private readonly _pokemonService: PokemonService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all pokemon' })
  @ApiExtraModels(PageDto, PokemonDto)
  @ApiPaginatedResponse(PokemonDto)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PokemonDto>> {
    return await this._pokemonService.getAll(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a task according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number',
    example: '10',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [DetailPokemonDto],
  })
  async getDetail(@Param('id') id: number): Promise<DetailPokemonDto> {
    return await this._pokemonService.getDetail(id);
  }

  @Get('pokemonAndTypes/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a pokemon and types according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'number',
    example: '11',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [PokemonAndTypesDto],
  })
  async getPokemonAndTypes(@Param('id') id: number): Promise<PokemonAndTypesDto> {
    return await this._pokemonService.getPokemonAndTypes(id);
  }
}
