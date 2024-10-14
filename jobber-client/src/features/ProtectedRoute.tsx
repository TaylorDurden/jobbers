import { FC, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import { Navigate, NavigateFunction, useNavigate } from 'react-router-dom';
import HomeHeader from 'src/shared/header/components/HomeHeader';
import { applicationLogout, saveToSessionStorage } from 'src/shared/utils/utils.service';
import { useAppDispatch, useAppSelector } from 'src/store/store';

import { addAuthUser } from './auth/reducers/auth.reducer';
import { useCheckCurrentUserQuery } from './auth/services/auth.service';
import { IAuthUser } from './auth/interfaces/auth.interface';

export interface IProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<IProtectedRouteProps> = ({ children }): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser) as IAuthUser;
  const showCategoryContainer = true;
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { data, isError } = useCheckCurrentUserQuery();

  const checkUser = useCallback(async () => {
    if (data && data.user) {
      setTokenIsValid(true);
      dispatch(addAuthUser({ authInfo: data.user }));
      saveToSessionStorage(JSON.stringify(true), JSON.stringify(authUser.username));
    }

    if (isError) {
      setTokenIsValid(false);
      applicationLogout(dispatch, navigate);
    }
  }, [data, dispatch, navigate, isError, authUser.username]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if ((data && data.user) || authUser) {
    if (tokenIsValid) {
      return (
        <>
          <HomeHeader showCategoryContainer={showCategoryContainer} />
          {children}
        </>
      );
    } else {
      return <></>;
    }
  } else {
    return <>{<Navigate to="/" />}</>;
  }
};

export default ProtectedRoute;
