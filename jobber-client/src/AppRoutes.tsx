import React, { FC, Suspense } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import AppPage from './features/AppPage';
import Home from './features/home/Home';
import ProtectedRoute from './features/ProtectedRoute';
import Error from './features/error/Error';
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
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
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
    },
    {
      path: '*', // routes not match above defined routes
      element: (
        <Suspense>
          <Error />
        </Suspense>
      )
    }
  ];
  return useRoutes(routes);
};
export default AppRouter;
