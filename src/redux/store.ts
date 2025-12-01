import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import globalReducer from './reducers/global';
import luckySheetReducer from './reducers/luckySheetSlice';
import projectReducer from './reducers/projectSlice';
import projectsReducer from './reducers/projectsSlice';
import stepReducer from './reducers/stepSlice';
import stepUpdateReducer from './reducers/stepUpdateSlice';

export const store = configureStore({
  reducer: {
    global: globalReducer,
    auth: authReducer,
    step: stepReducer,
    stepUpdate: stepUpdateReducer,
    project: projectReducer,
    projects: projectsReducer,
    luckySheet: luckySheetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
