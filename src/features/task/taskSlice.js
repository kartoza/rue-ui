import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTask: 'Site',
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
});

export const { setSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;
