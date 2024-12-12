import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

// Lazy loading of pages
export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ReservationsPage = lazy(() => import('src/pages/reservation'));
export const InvoicesPage = lazy(() => import('src/pages/invoices'));

// ----------------------------------------------------------------------

// Fallback for Suspense
const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// ----------------------------------------------------------------------

const isAuthenticated = () => !!localStorage.getItem('authToken');;

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: isAuthenticated() ? <HomePage /> : <Navigate to="/sign-in" />,
          index: true,
        },
        {
          path: 'user',
          element: isAuthenticated() ? <UserPage /> : <Navigate to="/sign-in" />,
        },
        {
          path: 'rented',
          element: isAuthenticated() ? <ProductsPage /> : <Navigate to="/sign-in" />,
        },
        {
          path: 'cars',
          element: isAuthenticated() ? <BlogPage /> : <Navigate to="/sign-in" />,
        },
        {
          path: 'réservations',
          element: isAuthenticated() ? <ReservationsPage /> : <Navigate to="/sign-in" />,
        },
        {
          path: 'invoices',
          element: isAuthenticated() ? <InvoicesPage /> : <Navigate to="/sign-in" />,
        },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
