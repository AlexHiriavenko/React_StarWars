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

  public async getData(options: Options): Promise<T> {
    const page = options.page || this.defaultPage;
    const limit = options.limit || this.defaultLimit;
    const defaultSearchKey = 'search';
    const searchKey = options.searchKey || defaultSearchKey;
    const searchValue = options.searchValue || '';

    try {
      const url = `${this.url}?${searchKey}=${searchValue}&page=${page}&limit=${limit}`;
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

      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error(`[BaseService] Ошибка при получении данных:`, error);
      throw error;
    }
  }
}
