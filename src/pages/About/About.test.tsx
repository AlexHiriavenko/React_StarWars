import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';

describe('About Page', () => {
  it('renders the main title', () => {
    render(<About />);
    expect(screen.getByText(/About This App/i)).toBeInTheDocument();
  });

  it('renders the RS School link', () => {
    render(<About />);
    const rsLink = screen.getByRole('link', {
      name: /React Course by RS School/i,
    });
    expect(rsLink).toHaveAttribute(
      'href',
      expect.stringContaining('rs.school')
    );
  });

  it('renders GitHub link with username', () => {
    render(<About />);
    const githubLink = screen.getByRole('link', {
      name: /github.com\/AlexHiriavenko/i,
    });
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/AlexHiriavenko/'
    );
  });

  it('renders email link with address', () => {
    render(<About />);
    const emailLink = screen.getByRole('link', {
      name: /martmarchmartmarch@gmail.com/i,
    });
    expect(emailLink).toHaveAttribute(
      'href',
      'mailto:martmarchmartmarch@gmail.com'
    );
  });

  it('renders copyright text', () => {
    render(<About />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} All rights reserved.`)
    ).toBeInTheDocument();
  });
});
