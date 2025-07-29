import type { CharacterResponse } from '@/services/types';
import { http, HttpResponse } from 'msw';
import {
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll,
  vi,
} from 'vitest';
import { BaseService } from '@/services/BaseService';
import { BASE_URL } from '@/services/constants';
import { server } from '@/mocks/server';

const BASE_ENDPOINT = 'people';
const service = new BaseService<CharacterResponse>(BASE_ENDPOINT);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('BaseService', () => {
  describe('getData', () => {
    it('возвращает список персонажей по поиску "Luke"', async () => {
      const result = await service.getData({
        searchValue: 'Luke',
      });

      expect(result).toEqual({
        count: 60,
        results: [
          {
            name: 'Luke Skywalker',
            url: expect.stringContaining('people/1'),
          },
        ],
      });
    });

    it('возвращает пустой результат по поиску "fail"', async () => {
      const result = await service.getData({
        searchValue: 'fail',
      });

      expect(result).toEqual({
        count: 0,
        results: [],
      });
    });
  });

  describe('getDataById', () => {
    it('возвращает персонажа с id=1', async () => {
      const result = await service.getDataById('1');

      expect(result).toEqual({
        name: 'LukeTest',
        gender: 'male',
        url: expect.stringContaining('people/1'),
      });
    });

    it('бросает ошибку при id=999', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(service.getDataById('999')).rejects.toThrow(
        'HTTP error: 404'
      );

      consoleErrorSpy.mockRestore();
    });

    it('бросает ошибку, если сервер вернул 500 при getData', async () => {
      server.use(
        http.get(
          `${BASE_URL}people`,
          () => new HttpResponse(null, { status: 500 })
        )
      );

      await expect(service.getData({})).rejects.toThrow('HTTP error: 500');
    });
  });
});
