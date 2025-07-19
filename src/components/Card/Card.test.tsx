import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';
import type { Character } from '../../AppTypes';

describe('Card Component', () => {
  it('displays item name and description correctly', () => {
    const sampleCharacter: Character = {
      uid: '1',
      name: 'Luke Skywalker',
      description: 'Jedi Knight',
      url: 'some-url',
    };

    render(<Card card={sampleCharacter} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/Jedi Knight/i)).toBeInTheDocument();
    expect(screen.getByAltText(/character photo/i)).toBeInTheDocument();
  });

  it('handles missing name and description gracefully', () => {
    const sampleCharacter: Character = {
      uid: '2',
      name: '',
      description: '',
      url: 'some-url',
      properties: {
        name: 'Fallback Name',
        created: '',
        edited: '',
        gender: '',
        skin_color: '',
        hair_color: '',
        height: '',
        eye_color: '',
        mass: '',
        homeworld: '',
        birth_year: '',
        url: '',
      },
    };

    render(<Card card={sampleCharacter} />);

    expect(screen.getByText(/Fallback Name/i)).toBeInTheDocument();
    const descElement = screen.getByText('', { selector: 'p' });
    expect(descElement).toBeInTheDocument();
  });
});
