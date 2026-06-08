import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderWithStore } from './test-utils/renderWithStore';

const pngFile = () => new File(['x'], 'a.png', { type: 'image/png' });

describe('App', () => {
  it('renders the page with an empty submissions state', () => {
    renderWithStore(<App />);
    expect(
      screen.getByRole('heading', { name: 'React Forms', level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
  });

  it('opens the uncontrolled form modal and shows the submission after submit', async () => {
    const user = userEvent.setup();
    renderWithStore(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Open uncontrolled form' })
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Name'), 'Alice');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.click(screen.getByLabelText('female'));
    await user.type(screen.getByLabelText('Country'), 'Georgia');
    await user.type(screen.getByLabelText('Password'), 'Abc1!');
    await user.type(screen.getByLabelText('Confirm password'), 'Abc1!');
    await user.upload(screen.getByLabelText(/profile image/i), pngFile());
    await user.click(screen.getByLabelText(/accept the terms/i));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    const card = screen.getByTestId('submission-card');
    expect(card).toHaveTextContent('Alice');
    expect(card.className).toMatch(/new/);
  });

  it('opens the React Hook Form modal', async () => {
    const user = userEvent.setup();
    renderWithStore(<App />);

    await user.click(
      screen.getByRole('button', { name: 'Open React Hook Form' })
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'React Hook Form', level: 2 })
    ).toBeInTheDocument();
  });
});
