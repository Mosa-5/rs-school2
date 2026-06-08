import { render, screen } from '@testing-library/react';
import FieldError from './FieldError';

describe('FieldError', () => {
  it('shows the message with an alert role', () => {
    render(<FieldError message="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('renders an empty placeholder with no alert role when there is no message', () => {
    render(<FieldError />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
