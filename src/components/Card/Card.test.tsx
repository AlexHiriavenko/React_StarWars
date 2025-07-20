import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';
import type { Character } from '../../AppTypes';

describe('Card Component', () => {
  it('displays item name and gender correctly', () => {
    const sampleCharacter: Character = {
      name: 'Luke Skywalker',
      gender: 'male',
      url: 'some-url',
    };

    render(<Card card={sampleCharacter} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/male/i)).toBeInTheDocument();
    expect(screen.getByAltText(/character photo/i)).toBeInTheDocument();
  });

  it('handles missing name and gender gracefully', () => {
    const sampleCharacter: Character = {
      name: '',
      gender: '',
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

    // Проверка что отображается "gender: unknown"
    const genderElement = screen.getByText((text, element) => {
      return (
        element?.tagName.toLowerCase() === 'p' &&
        text.trim() === 'gender: unknown'
      );
    });

    expect(genderElement).toBeInTheDocument();
  });
});
