import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import taskReducer from './reducers/taskSlice';
import siteDefinitionReducer from './reducers/definitionSlice';
import projectReducer from './reducers/projectSlice';

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
