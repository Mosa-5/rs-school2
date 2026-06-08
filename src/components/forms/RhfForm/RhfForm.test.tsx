import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { renderWithStore } from '../../../test-utils/renderWithStore';
import RhfForm from './RhfForm';

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

describe('RhfForm', () => {
  it('disables submit until the form is valid', () => {
    renderWithStore(<RhfForm onSuccess={() => {}} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('enables submit and stores valid data', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(<RhfForm onSuccess={onSuccess} />);

    await fillValidForm(user);

    const submit = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submit).toBeEnabled());

    await user.click(submit);

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const items = store.getState().submissions.items;
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Alice');
  });
});
