import { delay, http, HttpResponse } from 'msw';
import type { SwapiPeopleResponse } from '@/types/AppTypes';
import { BASE_URL } from '@/services/constants';

const mockCharacterResponse: SwapiPeopleResponse = {
  results: [
    {
      name: 'Luke Skywalker',
      gender: 'male',
      url: `${BASE_URL}people/1/`,
    },
  ],
  count: 80,
  previous: null,
  next: null,
};

export const handlers = [
  http.get(`${BASE_URL}people`, async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const page = Number(url.searchParams.get('page')) || 1;

    if (search === 'fail') {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    if (search?.toLowerCase() === 'leia') {
      await delay(50);
      return HttpResponse.json({
        results: [
          {
            name: 'Leia Organa',
            gender: 'female',
            url: `${BASE_URL}people/5/`,
          },
        ],
        total_pages: 1,
        previous: null,
        next: null,
      });
    }

    if (search?.toLowerCase() === 'pagination') {
      const options = {
        count: 82,
        next: `${BASE_URL}people?page=${Number(page) + 1}`,
        previous: page > 1 ? `${BASE_URL}people?page=${page - 1}` : null,
      };

      return HttpResponse.json({
        count: options.count,
        next: options.next,
        previous: options.previous,
        results: [
          {
            name: 'Test Character',
            gender: 'n/a',
            url: `${BASE_URL}people/1/`,
          },
        ],
      });
    }

    return HttpResponse.json(mockCharacterResponse);
  }),
];
