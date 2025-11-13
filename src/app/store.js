import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/task/taskSlice';
import siteDefinitionReducer from '../features/site_definition/definitionSlice';
import projectReducer from '../features/project/projectSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    definition: siteDefinitionReducer,
    project: projectReducer,
  },
});
