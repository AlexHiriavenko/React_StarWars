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
  uid: string;
  name: string;
  url: string;
  description: string;
  properties?: {
    created: string;
    edited: string;
    name: string;
    gender: string;
    skin_color: string;
    hair_color: string;
    height: string;
    eye_color: string;
    mass: string;
    homeworld: string;
    birth_year: string;
    url: string;
  };
}

export interface SwapiPeopleResponse {
  message: string;
  total_records: number;
  total_pages: number;
  previous: string | null;
  next: string | null;
  results?: Character[];
  result?: Character[];
}
