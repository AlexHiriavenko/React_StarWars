export interface AppState {
  cards: Character[];
  loading: boolean;
  searchParams: {
    searchValue: string;
    searchKey: string;
    limit: number;
  };
  pagination: {
    currentPage?: number;
    nextPage: string | null;
    prevPage: string | null;
    total_pages: number;
  };
}

export interface Character {
  name: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  gender: string;
  homeworld?: string;
  films?: string[];
  species?: string[];
  vehicles?: string[];
  starships?: string[];
  created?: string;
  edited?: string;
  url: string;
}

export type CharacterDetails = Character | null;

export interface SwapiPeopleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}
