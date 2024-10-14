import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { applicationLogout, saveToSessionStorage } from 'src/shared/utils/utils.service';
import HomeHeader from 'src/shared/header/components/HomeHeader';
import Index from './index/Index';
import { useCheckCurrentUserQuery } from './auth/services/auth.service';
import { addAuthUser } from './auth/reducers/auth.reducer';
import { IAuthUser } from './auth/interfaces/auth.interface';
import Home from './home/Home';

const AppPage: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser) as IAuthUser;
  const appLogout = useAppSelector((state) => state.logout) as boolean;
  const showCategoryContainer = true;
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { data: currentUserData, isError } = useCheckCurrentUserQuery(undefined, { skip: authUser.id === null });
  console.log(currentUserData);
  console.log(isError);

  const checkUser = useCallback(async () => {
    try {
      if (currentUserData && currentUserData.user && !appLogout) {
        setTokenIsValid(true);
        dispatch(addAuthUser({ authInfo: currentUserData.user }));
        // dispatch buyer info
        // dispatch seller info
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(currentUserData.user.username));
      }
    } catch (error) {
      console.error(error);
    }
  }, [appLogout, currentUserData, dispatch]);

  const logoutUser = useCallback(async () => {
    if ((!currentUserData && appLogout) || isError) {
      setTokenIsValid(false);
      applicationLogout(dispatch, navigate);
    }
  }, [currentUserData, dispatch, navigate, appLogout, isError]);

  useEffect(() => {
    checkUser();
    logoutUser();
  }, [checkUser, logoutUser]);

  if (authUser) {
    return !tokenIsValid && !authUser.id ? (
      <Index />
    ) : (
      <>
        <HomeHeader showCategoryContainer={showCategoryContainer} />
        <Home />
      </>
    );
  } else {
    return <Index />;
  }
};

export default AppPage;
