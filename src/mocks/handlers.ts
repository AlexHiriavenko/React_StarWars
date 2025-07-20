import { delay, http, HttpResponse } from 'msw';
import type { SwapiPeopleResponse } from '../AppTypes';

export const mockCharacterResponse: SwapiPeopleResponse = {
  results: [
    {
      uid: '1',
      name: 'Luke Skywalker',
      description: 'Jedi Knight',
      url: 'https://swapi.dev/api/people/1/',
    },
  ],
  total_pages: 1,
  previous: null,
  next: null,
  message: '',
  total_records: 80,
};

export const handlers = [
  http.get('https://swapi.tech/api/people', async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('name');

    if (search === 'fail') {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    if (search?.toLowerCase() === 'leia') {
      await delay(50);
      return HttpResponse.json({
        results: [
          {
            uid: '2',
            name: 'Leia Organa',
            description: 'Princess',
            url: 'https://swapi.dev/api/people/2/',
          },
        ],
        total_pages: 1,
        previous: null,
        next: null,
      });
    }

    return HttpResponse.json(mockCharacterResponse);
  }),
];
