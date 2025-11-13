import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTask: 'Site',
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.currentTask = action.payload;
    },
  },
});

export const { setSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;
