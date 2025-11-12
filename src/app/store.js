import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/task/taskSlice';
import siteDefinitionReducer from '../features/site_definition/definitionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    definition: siteDefinitionReducer,
  },
});
