import { Component } from 'react';
import type { ReactNode } from 'react';
import './App.css';
import BuggyButton from './components/BuggyButton';

class App extends Component {
  render(): ReactNode {
    return (
      <>
        <h1 className="text-4xl font-bold text-yellow-400 text-center mt-10 drop-shadow-lg">
          StarWars
        </h1>
        <BuggyButton />
      </>
    );
  }
}

export default App;
