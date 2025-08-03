import type { Character } from '@/types/AppTypes';
import { DownloadFileService } from '@/services/DownloadFileService';

const FIELDS: (keyof Character)[] = [
  'name',
  'height',
  'mass',
  'hair_color',
  'skin_color',
  'eye_color',
  'birth_year',
  'gender',
  'homeworld',
  'url',
];

export function downloadCharactersAsCSV(characters: Character[]): void {
  if (!characters.length) return;

  const delimiter = ';';
  const header = FIELDS.join(delimiter);

  const rows = characters.map((char) =>
    FIELDS.map((key) => {
      const value = char[key];
      const cell = typeof value === 'string' ? value : '';
      return `"${cell.replace(/"/g, '""')}"`;
    }).join(delimiter)
  );

  const content = [header, ...rows].join('\n');
  const fileName = `${characters.length}_items.csv`;
  const mimeType = 'text/csv';

  const downloadService = new DownloadFileService();
  downloadService.downloadFile(content, fileName, mimeType);
}
