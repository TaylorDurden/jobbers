import React, { FC, ReactNode, Suspense } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import AppPage from './features/AppPage';
import Home from './features/home/Home';
import ProtectedRoute from './features/ProtectedRoute';
import Error from './features/error/Error';
import BuyerDashboard from './features/buyer/components/Dashboard';
import AddSeller from './features/sellers/interfaces/components/add/AddSeller';
const ResetPassword = React.lazy(() => import('src/features/auth/components/ResetPassword'));
const ConfirmEmail = React.lazy(() => import('src/features/auth/components/ConfirmEmail'));

const Layout = ({ backgroundColor = '#fff', children }: { backgroundColor: string; children: ReactNode }): JSX.Element => (
  <div style={{ backgroundColor }} className="flex flex-grow">
    {children}
  </div>
);

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
      path: '/users/:username/:buyerId/orders',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <BuyerDashboard />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/seller_onboarding',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <AddSeller />
            </Layout>
          </ProtectedRoute>
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
