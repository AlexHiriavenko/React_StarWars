import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '@/components/Pagination/Pagination';

describe('Pagination component', () => {
  it('renders nothing if totalPages <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders buttons equal to totalPages', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
    expect(buttons.map((btn) => btn.textContent)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
  });

  it('highlights the currentPage button', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />
    );

    const activeButton = screen.getByRole('button', { name: '3' });
    expect(activeButton).toHaveClass('bg-accent');
  });

  it('calls onPageChange with correct page number when button is clicked', () => {
    const mockHandler = vi.fn();

    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={mockHandler} />
    );

    const button = screen.getByRole('button', { name: '2' });
    fireEvent.click(button);

    expect(mockHandler).toHaveBeenCalledWith(2);
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
