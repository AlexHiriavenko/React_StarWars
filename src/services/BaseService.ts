export interface Options {
  page?: number;
  limit?: number;
  searchValue?: string;
  searchKey?: string;
}

export class BaseService<T> {
  private readonly baseURL: string;

  constructor(endpoint: string) {
    this.baseURL = `https://swapi.tech/api/${endpoint}`;
  }

  public async getData(options: Options): Promise<T> {
    const page = options.page || 1;
    const limit = options.limit || 8;
    const defaultSearchKey = 'name';
    const searchKey = options.searchKey || defaultSearchKey;
    const searchValue = options.searchValue || '';

    try {
      const url = `${this.baseURL}?${searchKey}=${searchValue}&expanded=true&page=${page}&limit=${limit}`;
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
