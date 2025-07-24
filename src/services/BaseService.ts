import { BASE_URL } from '@/services/constants';

export interface Options {
  page?: number;
  limit?: number;
  searchValue?: string;
  searchKey?: string;
}

export class BaseService<T> {
  protected readonly url: string;
  protected readonly defaultLimit = 10;
  protected readonly defaultPage = 1;

  constructor(endpoint: string) {
    this.url = `${BASE_URL}${endpoint}`;
  }

  public async getData<T2 = T>(options: Options): Promise<T2> {
    const page = options.page ?? this.defaultPage;
    const limit = options.limit ?? this.defaultLimit;
    const searchKey = options.searchKey ?? 'search';
    const searchValue = options.searchValue ?? '';

    const url = `${this.url}?${searchKey}=${searchValue}&page=${page}&limit=${limit}`;

    try {
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
    } catch (error) {
      console.error(`[BaseService] Ошибка при получении данных:`, error);
      throw error;
    }
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
