import type { Character, SwapiPeopleResponse, AppState } from '@/App/AppTypes';
import type { Options } from '@/services/BaseService';
import { BaseService } from '@/services';

export class CharacterService extends BaseService<SwapiPeopleResponse> {
  constructor() {
    super('people');
  }

  public async fetchCharacters(
    options: Options,
    setPagination?: (pagination: AppState['pagination']) => void
  ): Promise<Character[]> {
    const response = await this.getData(options);

    const nextPage = response.next
      ? new URL(response.next).searchParams.get('page')
      : null;

    const prevPage = response.previous
      ? new URL(response.previous).searchParams.get('page')
      : null;
    const currentPage = prevPage ? Number(prevPage) + 1 : this.defaultPage;

    if (setPagination) {
      setPagination({
        nextPage,
        prevPage,
        total_pages: Math.ceil(
          response.count / (options?.limit || this.defaultLimit)
        ),
        currentPage,
      });
    }

    return response.results;
  }
}
