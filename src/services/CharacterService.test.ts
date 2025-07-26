// import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
// import { CharacterService } from '@/services/CharacterService';
// import { server } from '@/mocks';

// describe('CharacterService pagination parsing', () => {
//   beforeAll(() => {
//     server.listen();
//   });

//   afterAll(() => {
//     server.close();
//   });

//   it('parses nextPage and prevPage correctly from response URLs', async () => {
//     const service = new CharacterService();
//     const mockSetPagination = vi.fn();

//     const characters = await service.fetchCharacters(
//       { searchValue: 'pagination', page: 2, limit: 10 },
//       mockSetPagination
//     );

//     expect(characters).toHaveLength(1);
//     expect(characters[0].name).toBe('Test Character');

//     expect(mockSetPagination).toHaveBeenCalledWith(
//       expect.objectContaining({
//         nextPage: '3',
//         prevPage: '1',
//       })
//     );
//   });
// });
