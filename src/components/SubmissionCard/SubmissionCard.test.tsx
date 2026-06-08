import { render, screen } from '@testing-library/react';
import SubmissionCard from './SubmissionCard';
import type { Submission } from '../../types/submission';

const submission: Submission = {
  id: '1',
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  gender: 'female',
  country: 'Georgia',
  acceptTerms: true,
  image: 'data:image/png;base64,abc',
  createdAt: 0,
};

describe('SubmissionCard', () => {
  it('renders the submission details', () => {
    render(<SubmissionCard submission={submission} isNew={false} />);
    expect(screen.getByRole('heading', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Georgia')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', submission.image);
  });

  it('applies a highlight class when new', () => {
    render(<SubmissionCard submission={submission} isNew />);
    expect(screen.getByTestId('submission-card').className).toMatch(/new/);
  });
});
