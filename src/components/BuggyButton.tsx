import { Component } from 'react';
import type { ReactNode } from 'react';

interface BuggyButtonState {
  hasError: boolean;
}

class BuggyButton extends Component<unknown, BuggyButtonState> {
  constructor(props: unknown) {
    super(props);
    this.state = { hasError: false };
  }

  handleClick = (): void => {
    this.setState({ hasError: true });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      throw new Error('Button crashed!');
    }

    return (
      <button
        onClick={this.handleClick}
        className="bg-red-400  text-white font-bold py-2 px-4 rounded hover:border-white mt-4"
      >
        Generate Error
      </button>
    );
  }
}

export default BuggyButton;
