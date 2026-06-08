import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { ReactElement } from 'react';
import { setupStore, type AppStore } from '../store/store';

export function renderWithStore(ui: ReactElement, store: AppStore = setupStore()) {
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}
