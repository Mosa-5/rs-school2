import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <p>content</p>
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders children in a dialog when open', () => {
    render(
      <Modal isOpen onClose={() => {}} title="My modal">
        <p>content</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.getByText('My modal')).toBeInTheDocument();
  });

  it('moves focus to the first focusable element on open', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <button type="button">Inside</button>
      </Modal>
    );
    expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus();
  });

  it('closes on Escape key', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when clicking the overlay but not the content', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose}>
        <p>content</p>
      </Modal>
    );

    await user.click(screen.getByText('content'));
    expect(onClose).not.toHaveBeenCalled();

    const overlay = screen.getByRole('dialog').parentElement as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('traps focus and wraps from the last element to the first', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={() => {}}>
        <button type="button">Last</button>
      </Modal>
    );

    const close = screen.getByRole('button', { name: 'Close modal' });
    const last = screen.getByRole('button', { name: 'Last' });
    last.focus();
    await user.tab();
    expect(close).toHaveFocus();
  });

  it('closes via the close button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose}>
        <p>content</p>
      </Modal>
    );
    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalled();
  });
});
