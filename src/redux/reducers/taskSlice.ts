import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TaskState {
  currentTask: string;
}

const initialState: TaskState = {
  currentTask: 'Site',
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<string>) => {
      state.currentTask = action.payload;
    },
  },
});

export const { setSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;
