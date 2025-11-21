import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import siteDefinitionReducer from './reducers/definitionSlice';
import projectReducer from './reducers/projectSlice';
import stepReducer from './reducers/stepSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    step: stepReducer,
    definition: siteDefinitionReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
