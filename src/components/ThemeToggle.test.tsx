import React from 'react';
import { render, screen } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders correctly', () => {
    render(<ThemeToggle />);
    const themeToggleElement = screen.getByRole('button');
    expect(themeToggleElement).toBeInTheDocument();
  });
});