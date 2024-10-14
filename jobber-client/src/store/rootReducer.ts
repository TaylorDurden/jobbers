import { combineReducers } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from 'src/features/auth/reducers/auth.reducer';
import logoutReducer from 'src/features/auth/reducers/logout.reducer';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  authUser: authReducer,
  logout: logoutReducer
});

export default rootReducer;
