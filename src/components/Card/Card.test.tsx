import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { Character } from '@/App/AppTypes';
import { Card } from '@/components/Card';

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
    };

    render(<Card card={sampleCharacter} />);

    const nameElement = screen.getByText((text, element) => {
      return (
        element?.tagName.toLowerCase() === 'h3' && text.trim() === 'unknown'
      );
    });

    expect(nameElement).toBeInTheDocument();

    const genderElement = screen.getByText((text, element) => {
      return (
        element?.tagName.toLowerCase() === 'p' &&
        text.trim() === 'gender: unknown'
      );
    });

    expect(genderElement).toBeInTheDocument();
  });
});
