import type { Character } from '@/types/AppTypes';
import type { Mock } from 'vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DownloadFileService } from '@/services/DownloadFileService';
import { downloadCharactersAsCSV } from './downloadCSV';

vi.mock('@/services/DownloadFileService');

describe('downloadCharactersAsCSV', () => {
  const mockedDownload = vi.fn();
  const MockedService = DownloadFileService as unknown as Mock;

  beforeEach(() => {
    mockedDownload.mockClear();

    MockedService.mockImplementation(() => ({
      downloadFile: mockedDownload,
    }));
  });

  it('should not call downloadFile if character list is empty', () => {
    downloadCharactersAsCSV([]);
    expect(mockedDownload).not.toHaveBeenCalled();
  });

  it('should call downloadFile with correct content, name, and type', () => {
    const characters: Character[] = [
      {
        name: 'Luke',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.dev/api/planets/1/',
        url: 'https://swapi.dev/api/people/1/',
      },
    ];

    downloadCharactersAsCSV(characters);

    expect(mockedDownload).toHaveBeenCalledTimes(1);

    const [content, fileName, mimeType] = mockedDownload.mock.calls[0];

    expect(fileName).toBe('1_items.csv');
    expect(mimeType).toBe('text/csv');
    expect(content).toContain('name;height;mass;hair_color;skin_color');
    expect(content).toContain('"Luke";"172";"77";"blond";"fair"');
  });

  it('should escape double quotes in values', () => {
    const characters: Character[] = [
      {
        name: 'Anakin "Darth Vader"',
        height: '188',
        mass: '84',
        hair_color: 'blond',
        skin_color: 'light',
        eye_color: 'blue',
        birth_year: '41.9BBY',
        gender: 'male',
        homeworld: 'https://swapi.dev/api/planets/1/',
        url: 'https://swapi.dev/api/people/4/',
      },
    ];

    downloadCharactersAsCSV(characters);

    const [content] = mockedDownload.mock.calls[0];
    expect(content).toContain('"Anakin ""Darth Vader"""');
  });

  it('should fallback to empty string if value is not a string', () => {
    const characters = [
      {
        name: 'Leia',
        height: '150',
        mass: 123 as unknown as string, // эмулируем неверный тип
        hair_color: 'brown',
        skin_color: 'light',
        eye_color: null as unknown as string, // тоже не строка
        birth_year: '19BBY',
        gender: 'female',
        homeworld: 'https://swapi.dev/api/planets/2/',
        url: 'https://swapi.dev/api/people/5/',
      },
    ];

    downloadCharactersAsCSV(characters);

    const [content] = mockedDownload.mock.calls[0];

    const massValue = content.split('\n')[1].split(';')[2]; // колонка mass
    const eyeColorValue = content.split('\n')[1].split(';')[5]; // колонка eye_color

    expect(massValue).toBe('""'); // число → ''
    expect(eyeColorValue).toBe('""'); // null → ''
  });
});
