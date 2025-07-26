import { lazy } from 'react';
import { CharacterDetailsRoute } from '@/components/CharacterDetailsRoute';
import { AppRoutes } from '@/router/AppRoutes';
import { MainLayout } from '@/router/MainLayout';

const Home = lazy(() => import('@/pages/Home/Home'));
const About = lazy(() => import('../pages/About/About'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

export const routes = [
  {
    path: AppRoutes.HOME,
    element: <MainLayout />,
    children: [
      {
        path: AppRoutes.HOME,
        element: <Home />,
        children: [
          {
            path: `${AppRoutes.DETAILS}/:id`,
            element: <CharacterDetailsRoute />, // содержит <Card />
          },
        ],
      },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
