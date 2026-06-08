import reducer, { addSubmission } from './submissionsSlice';
import type { SubmissionInput } from '../types/submission';

const input: SubmissionInput = {
  name: 'Rick',
  age: 30,
  email: 'rick@example.com',
  gender: 'male',
  country: 'Georgia',
  acceptTerms: true,
  image: 'data:image/png;base64,abc',
};

describe('submissionsSlice', () => {
  it('adds a submission with a generated id and timestamp', () => {
    const state = reducer(undefined, addSubmission(input));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe('Rick');
    expect(state.items[0].id).toEqual(expect.any(String));
    expect(state.items[0].createdAt).toEqual(expect.any(Number));
  });

  it('prepends newer submissions to the front', () => {
    let state = reducer(undefined, addSubmission(input));
    state = reducer(state, addSubmission({ ...input, name: 'Morty' }));
    expect(state.items[0].name).toBe('Morty');
    expect(state.items[1].name).toBe('Rick');
  });
});
