import type { CharacterResponse } from '@/services/types';
import { delay, http, HttpResponse } from 'msw';
import { BASE_URL } from '@/services/constants';

export const mockCharacterResponse: CharacterResponse = {
  name: 'LukeTest',
  gender: 'male',
  url: `${BASE_URL}people/1`,
};

const characterHandler = http.get(
  `${BASE_URL}people/:id`,
  async ({ params }) => {
    const { id } = params;
    await delay(50);

    if (id === '1') {
      return HttpResponse.json(mockCharacterResponse, { status: 200 });
    }

    return HttpResponse.json(
      { detail: `Character with ID ${id} not found` },
      { status: 404 }
    );
  }
);

const charactersListHandler = http.get(
  `${BASE_URL}people`,
  async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';

    await delay(50);

    // Пример фильтрации по "search"
    if (search === 'fail') {
      return HttpResponse.json({ count: 0, results: [] }, { status: 200 });
    }

    return HttpResponse.json(
      {
        count: 60,
        results: [
          {
            name: 'Luke Skywalker',
            url: `${BASE_URL}people/1`,
          },
        ],
      },
      { status: 200 }
    );
  }
);

export const handlers = [characterHandler, charactersListHandler];
