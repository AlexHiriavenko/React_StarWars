import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

function Hello() {
  return <h1>Hello, StarWars!</h1>;
}

describe('Smoke test', {}, () => {
  it('renders Hello component', () => {
    render(<Hello />);
    expect(screen.getByText('Hello, StarWars!')).toBeInTheDocument();
  });
});
