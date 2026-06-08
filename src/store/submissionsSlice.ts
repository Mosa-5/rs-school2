import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { Submission, SubmissionInput } from '../types/submission';

interface SubmissionsState {
  items: Submission[];
}

const initialState: SubmissionsState = {
  items: [],
};

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    addSubmission: {
      reducer(state, action: PayloadAction<Submission>) {
        state.items.unshift(action.payload);
      },
      prepare(data: SubmissionInput) {
        return {
          payload: {
            ...data,
            id: nanoid(),
            createdAt: Date.now(),
          },
        };
      },
    },
  },
});

export const { addSubmission } = submissionsSlice.actions;
export default submissionsSlice.reducer;
