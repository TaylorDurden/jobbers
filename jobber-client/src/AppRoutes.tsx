import React, { FC, Suspense } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import AppPage from './features/AppPage';
import Home from './features/home/Home';
const ResetPassword = React.lazy(() => import('src/features/auth/components/ResetPassword'));
const ConfirmEmail = React.lazy(() => import('src/features/auth/components/ConfirmEmail'));

const AppRouter: FC = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: (
        <Suspense>
          <AppPage />
        </Suspense>
      )
    },
    {
      path: '/',
      element: (
        <Suspense>
          <Home />
        </Suspense>
      )
    },
    {
      path: '/reset_password',
      element: (
        <Suspense>
          <ResetPassword />
        </Suspense>
      )
    },
    {
      path: 'confirm_email',
      element: (
        <Suspense>
          <ConfirmEmail />
        </Suspense>
      )
    }
  ];
  return useRoutes(routes);
};
export default AppRouter;
