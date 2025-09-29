import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Hero from '../../src/components/Hero';

describe('Hero component', () => {
  it('renders CTA links', () => {
    render(<Hero ctaHref="#contact" />);
    expect(screen.getByText('Commander mon site maintenant')).toBeInTheDocument();
    expect(screen.getByText('Voir nos réalisations')).toBeInTheDocument();
  });
});
