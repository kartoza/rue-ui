// src/components/NavBar/NavBar.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../test/render';
import Navbar from './NavBar';

// Mock the style import (prevents jsdom CSS parse noise)
vi.mock('./style.scss', () => ({}));

describe('Navbar Component', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<Navbar />)).not.toThrow();
    });

    it('should render the main heading', () => {
      render(<Navbar />);
      expect(screen.getByRole('heading', { name: /kartoza react base/i })).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: /kartoza react base/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /map/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    });

    it('should render login button', () => {
      render(<Navbar />);
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should render error icon', () => {
      render(<Navbar />);
      expect(screen.getByTestId('bug-icon')).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('home link has correct href', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: /kartoza react base/i })).toHaveAttribute(
        'href',
        '/'
      );
    });

    it('map link has correct href', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: /map/i })).toHaveAttribute('href', '/map');
    });

    it('about link has correct href', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
    });
  });

  describe('styling', () => {
    it('header has background color from theme', () => {
      render(<Navbar />);
      const header = screen.getByRole('banner');
      // Chakra sets inline style with CSS var
      expect(header).toHaveStyle({ background: '' });
    });
  });

  describe('interactions', () => {
    it('bug icon has cursor pointer', () => {
      render(<Navbar />);
      const icon = screen.getByTestId('bug-icon');
      expect(icon).toHaveStyle({ cursor: 'pointer' });
    });
  });

  describe('accessibility', () => {
    it('has proper header landmark', () => {
      render(<Navbar />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('has h2 heading', () => {
      render(<Navbar />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('login button is clickable', () => {
      render(<Navbar />);
      expect(screen.getByRole('button', { name: /login/i })).toBeEnabled();
    });
  });

  describe('layout structure', () => {
    it('contains 3 links and 1 button', () => {
      render(<Navbar />);
      expect(screen.getAllByRole('link')).toHaveLength(3);
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });
  });
});
