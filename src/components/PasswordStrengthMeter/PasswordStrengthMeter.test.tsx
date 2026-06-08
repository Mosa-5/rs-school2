import { render, screen } from '@testing-library/react';
import PasswordStrengthMeter from './PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
  it('shows all four criteria', () => {
    render(<PasswordStrengthMeter password="" />);
    expect(screen.getByText(/at least 1 number/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 1 uppercase/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 1 lowercase/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 1 special/i)).toBeInTheDocument();
  });

  it('reports a strong password', () => {
    render(<PasswordStrengthMeter password="Abc1!" />);
    expect(screen.getByText('strong')).toBeInTheDocument();
  });
});
