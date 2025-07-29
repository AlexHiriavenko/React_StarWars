import { Component } from 'react';

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-600">
          <h2 className="text-xl font-semibold">
            Caught by ErrorBoundary: Something went wrong.
          </h2>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
