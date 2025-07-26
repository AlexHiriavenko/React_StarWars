import type {
  QueryParams,
  CharacterResponse,
  CharactersResponse,
} from '@/services/types';
import { BaseService } from '@/services';

export class CharacterService extends BaseService<CharactersResponse> {
  constructor() {
    super('people');
  }

  public async fetchCharacters(
    queryParams: QueryParams
  ): Promise<CharactersResponse> {
    return await this.getData<CharactersResponse>(queryParams);
  }

  public async fetchCharacter(id: string): Promise<CharacterResponse> {
    return await this.getDataById<CharacterResponse>(id);
  }
}
