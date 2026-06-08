import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { renderWithStore } from '../../../test-utils/renderWithStore';
import UncontrolledForm from './UncontrolledForm';

const pngFile = () => new File(['x'], 'a.png', { type: 'image/png' });

async function fillValidForm(user: UserEvent) {
  await user.type(screen.getByLabelText('Name'), 'Alice');
  await user.type(screen.getByLabelText('Age'), '25');
  await user.type(screen.getByLabelText('Email'), 'alice@example.com');
  await user.click(screen.getByLabelText('female'));
  await user.type(screen.getByLabelText('Country'), 'Georgia');
  await user.type(screen.getByLabelText('Password'), 'Abc1!');
  await user.type(screen.getByLabelText('Confirm password'), 'Abc1!');
  await user.upload(screen.getByLabelText(/profile image/i), pngFile());
  await user.click(screen.getByLabelText(/accept the terms/i));
}

describe('UncontrolledForm', () => {
  it('renders the form fields', () => {
    renderWithStore(<UncontrolledForm onSuccess={() => {}} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText(/profile image/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty', async () => {
    const user = userEvent.setup();
    renderWithStore(<UncontrolledForm onSuccess={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  it('submits valid data and reports the new submission', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(
      <UncontrolledForm onSuccess={onSuccess} />
    );

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const items = store.getState().submissions.items;
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Alice');
    expect(items[0].image).toMatch(/^data:image\/png/);
  });
});
