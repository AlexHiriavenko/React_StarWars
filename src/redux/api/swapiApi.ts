import type { CharacterResponse, CharactersResponse } from '@/services/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/services/constants';

type PeopleResponse = CharactersResponse;
type Person = CharacterResponse;

export const swapiApi = createApi({
  reducerPath: 'swapiApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }), // 'https://swapi.py4e.com/api/'
  tagTypes: ['People', 'Person'],
  endpoints: (build) => ({
    getPeople: build.query<
      PeopleResponse,
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      { page?: number; search?: string } | void
    >({
      query: (args) => {
        const page = args?.page ?? 1;
        const search = args?.search ?? '';
        return {
          url: 'people',
          params: {
            page,
            ...(search ? { search } : {}),
          },
        };
      },
      providesTags: (res) => [
        { type: 'People', id: 'LIST' },
        ...(res?.results ?? []).map((p) => {
          const id = p.url.split('/').filter(Boolean).pop();
          return { type: 'Person', id } as const;
        }),
      ],
      keepUnusedDataFor: 120, // храним кеш 2 минуты
    }),

    getPerson: build.query<Person, string | number>({
      query: (id) => `people/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Person', id }],
      keepUnusedDataFor: 120, // храним кеш 2 минуты
    }),
  }),
});

export const { useGetPeopleQuery, useGetPersonQuery } = swapiApi;
