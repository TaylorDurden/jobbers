import { combineReducers } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from 'src/features/auth/reducers/auth.reducer';
import logoutReducer from 'src/features/auth/reducers/logout.reducer';
import buyerReducer from 'src/features/buyer/reducers/buyer.reducer';
import headerReducer from 'src/shared/header/reducers/header.reducer';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  authUser: authReducer,
  logout: logoutReducer,
  buyer: buyerReducer,
  header: headerReducer
});

export default rootReducer;
