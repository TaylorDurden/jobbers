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
import { useGetCurrentBuyerByUsernameQuery } from './buyer/services/buyer.service';
import { addBuyer } from './buyer/reducers/buyer.reducer';
import { useGetSellerByUsernameQuery } from './sellers/services/seller.service';
import CircularPageLoader from 'src/shared/page-loader/CircularPageLoader';

const AppPage: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser) as IAuthUser;
  const appLogout = useAppSelector((state) => state.logout) as boolean;
  const showCategoryContainer = true;
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { data: currentUserData, isError } = useCheckCurrentUserQuery(undefined, { skip: authUser.id === null });
  const { data: buyerData, isLoading: isBuyerLoading } = useGetCurrentBuyerByUsernameQuery(undefined, { skip: authUser.id === null });
  const { data: sellerData, isLoading: isGetSellerLoading } = useGetSellerByUsernameQuery(`${authUser.username}`, {
    skip: authUser.id === null
  });

  console.log(currentUserData);
  console.log(isError);

  const checkUser = useCallback(async () => {
    try {
      if (currentUserData && currentUserData.user && !appLogout) {
        setTokenIsValid(true);
        dispatch(addAuthUser({ authInfo: currentUserData.user }));
        dispatch(addBuyer(buyerData?.buyer));
        dispatch(addBuyer(sellerData?.seller));
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(currentUserData.user.username));
      }
    } catch (error) {
      console.error(error);
    }
  }, [appLogout, buyerData?.buyer, currentUserData, dispatch]);

  const logoutUser = useCallback(async () => {
    if ((!currentUserData && appLogout) || isError) {
      setTokenIsValid(false);
      applicationLogout(dispatch, navigate);
    }
  }, [currentUserData, dispatch, navigate, appLogout, isError]);

  useEffect(() => {
    checkUser();
    logoutUser();
    console.log(1111);
  }, [checkUser, logoutUser]);

  if (authUser) {
    return !tokenIsValid && !authUser.id ? (
      <Index />
    ) : (
      <>
        {isBuyerLoading && isGetSellerLoading ? (
          <CircularPageLoader />
        ) : (
          <>
            <HomeHeader showCategoryContainer={showCategoryContainer} />
            <Home />
          </>
        )}
      </>
    );
  } else {
    return <Index />;
  }
};

export default AppPage;
