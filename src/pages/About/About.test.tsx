import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';
import { TestProviders } from '@/mocks/TestProviders';

describe('About Page', () => {
  const renderAbout = () =>
    render(
      <TestProviders>
        <About />
      </TestProviders>
    );

  it('renders the main title', () => {
    renderAbout();
    expect(screen.getByText(/About This App/i)).toBeInTheDocument();
  });

  it('renders the RS School link', () => {
    renderAbout();
    const rsLink = screen.getByRole('link', {
      name: /React Course by RS School/i,
    });
    expect(rsLink).toHaveAttribute(
      'href',
      expect.stringContaining('rs.school')
    );
  });

  it('renders GitHub link with username', () => {
    renderAbout();
    const githubLink = screen.getByRole('link', {
      name: /github.com\/AlexHiriavenko/i,
    });
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/AlexHiriavenko/'
    );
  });

  it('renders email link with address', () => {
    renderAbout();
    const emailLink = screen.getByRole('link', {
      name: /martmarchmartmarch@gmail.com/i,
    });
    expect(emailLink).toHaveAttribute(
      'href',
      'mailto:martmarchmartmarch@gmail.com'
    );
  });

  it('renders copyright text', () => {
    renderAbout();
    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} All rights reserved.`)
    ).toBeInTheDocument();
  });
});
