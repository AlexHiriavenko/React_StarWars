import { BaseService } from './BaseService';
import type { Options } from './BaseService';
import type { Character, SwapiPeopleResponse, AppState } from '../AppTypes';

export class CharacterService extends BaseService<SwapiPeopleResponse> {
  constructor() {
    super('people');
  }

  public async fetchCharacters(
    options: Options,
    setPagination?: (pagination: AppState['pagination']) => void
  ): Promise<Character[]> {
    const response = await this.getData(options);

    if (response.results) {
      const nextPage = response.next
        ? new URLSearchParams(response.next).get('page')
        : null;
      const prevPage = response.previous
        ? new URLSearchParams(response.previous).get('page')
        : null;
      const currentPage = prevPage ? Number(prevPage) + 1 : 1;

      if (setPagination) {
        setPagination({
          nextPage,
          prevPage,
          total_pages: response.total_pages,
          currentPage,
        });
      }

      return response.results;
    }

    if (response.result) {
      const limit = 8;
      return response.result.length > limit
        ? response.result.slice(0, limit)
        : response.result;
    }

    throw new Error('error: no results');
  }
}
