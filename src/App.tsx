import { Component } from 'react';
import type { ReactNode } from 'react';
import './App.css';
import BuggyButton from './components/BuggyButton';
import type { AppState, Character } from './AppTypes';
import Home from './pages/Home';
import Search from './components/Search/Search';
import { CharacterService } from './services/CharacterService';

const initialState: AppState = {
  cards: [],
  loading: true,
  searchParams: {
    searchValue: '',
    searchKey: 'name',
    limit: 10,
  },
  pagination: {
    currentPage: 1,
    nextPage: null,
    prevPage: null,
    total_pages: 1,
  },
};

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = initialState;
  }

  componentDidMount(): void {
    const search = localStorage.getItem('search') || '';
    this.setState(
      (prev) => ({
        loading: true,
        searchParams: {
          ...prev.searchParams,
          searchValue: search,
        },
      }),
      async () => {
        const characterService = new CharacterService();
        const characters = await characterService.fetchCharacters(
          { searchValue: search },
          this.setPagination
        );
        this.setCards(characters);
        this.setState({ loading: false });
      }
    );
  }

  setCards = (cards: Character[]): void => {
    this.setState({ cards });
  };

  setLoading = (bool: boolean): void => {
    this.setState({ loading: bool });
  };

  setPagination = (pagination: AppState['pagination']): void => {
    this.setState({ pagination });
  };

  render(): ReactNode {
    const { cards, loading } = this.state;

    return (
      <>
        <header className="header-main">
          <h1 className="app-title">Star Wars</h1>
          <Search
            updateCards={this.setCards}
            setLoading={this.setLoading}
            setPagination={this.setPagination}
          />
          <BuggyButton />
        </header>
        <Home cards={cards} loading={loading} />
      </>
    );
  }
}

export default App;
