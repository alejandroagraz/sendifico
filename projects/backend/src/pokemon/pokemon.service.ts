import {HttpException, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {HttpService} from '@nestjs/axios';
import {firstValueFrom} from 'rxjs';
import {PageOptionsDto} from '../common/dtos/page-options.dto';
import {PageDto} from '../common/dtos/page.dto';
import {PageMetaDto} from '../common/dtos/page-meta.dto';
import {PokemonDto} from "./dto/pokemon.dto";
import {config} from "dotenv";
import {DetailPokemonDto} from "./dto/detail-pokemon.dto";
import {PokemonAndTypesDto} from "./dto/pokemon-and-types.dto";

config();
const _configService = new ConfigService();

@Injectable()
export class PokemonService {
  constructor(
      private readonly _configService: ConfigService,
      private readonly httpService: HttpService,
  ) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<PokemonDto>> {
    const data = await this.httpService
        .get(
            `${_configService.get('API_EXT')}?offset=${pageOptionsDto.page===1?0:pageOptionsDto.page}&limit=${pageOptionsDto.take}`,
        )
        .toPromise()
        .then((res) => res.data)
        .catch((err) => err);

    const itemCount = data.count;
    const documents = data.results;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(documents, pageMetaDto);
  }

  async getDetail(id: number): Promise<DetailPokemonDto> {
    try {
      const detailPokemon = new DetailPokemonDto();
      const resp = await firstValueFrom(this.httpService.get(`${_configService.get('API_EXT')}/${id}`));

      detailPokemon.name = resp.data.name;
      detailPokemon.types = resp.data.types;

      return detailPokemon;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async getPokemonAndTypes(id: number): Promise<PokemonAndTypesDto> {
    const types = [];
    const pokemonAndTypes = new PokemonAndTypesDto()
    try {
      const resp = await firstValueFrom(this.httpService.get(`${_configService.get('API_EXT')}/${id}`));

      for (const value of resp.data.types) {
        value.names = await this.getPokemonTranslations(value.type.url)
        types.push(value)
      }

      pokemonAndTypes.name = resp.data.name;
      pokemonAndTypes.types = types;

      return pokemonAndTypes;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  private async getPokemonTranslations(url: string) {
    try {
      const names = [];
      const resp: any = await firstValueFrom(this.httpService.get(url));

      resp.data.names.find(name => {
          if (name.language.name === 'es') {
            names.push(name)
          }
        });

      resp.data.names.find(name => {
          if (name.language.name === 'ja') {
            names.push(name)
          }
        });

      return names;
    } catch (error) {
      throw new Error('Error fetching Pokémon translations');
    }
  }
}
