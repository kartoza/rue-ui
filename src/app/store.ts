import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.ts';
import taskReducer from '../features/task/taskSlice.ts';
import siteDefinitionReducer from '../features/site_definition/definitionSlice.ts';
import projectReducer from '../features/project/projectSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    definition: siteDefinitionReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
