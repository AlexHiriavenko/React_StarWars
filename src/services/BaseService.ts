import type { QueryParams } from '@/services/types';
import { BASE_URL } from '@/services/constants';

export class BaseService<T> {
  protected readonly url: string;
  protected readonly defaultLimit = 10;
  protected readonly defaultPage = 1;
  protected readonly defaultSearchKey = 'search';

  constructor(endpoint: string) {
    this.url = `${BASE_URL}${endpoint}`;
  }

  public async getData<T2 = T>(queryParams: QueryParams): Promise<T2> {
    const page = queryParams.page ?? this.defaultPage;
    const limit = queryParams.limit ?? this.defaultLimit;
    const searchKey = queryParams.searchKey ?? this.defaultSearchKey;
    const searchValue = queryParams.searchValue;

    const url = searchValue
      ? `${this.url}?${searchKey}=${searchValue}&page=${page}&limit=${limit}`
      : `${this.url}?page=${page}&limit=${limit}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  }

  public async getDataById<T2 = T>(id: string): Promise<T2> {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Connection: 'keep-alive',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[BaseService] Ошибка при получении данных по ID:`, error);
      throw error;
    }
  }
}
