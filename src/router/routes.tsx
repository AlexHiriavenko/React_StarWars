import { lazy } from 'react';
import { CharacterDetailsRoute } from '@/components/CharacterDetailsRoute';
import { MainLayout } from '@/router/';
const Home = lazy(() => import('@/pages/Home/Home'));
const About = lazy(() => import('../pages/About/About'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Home />,
        children: [
          {
            path: 'details/:id',
            element: <CharacterDetailsRoute />, // содержит <Card />
          },
        ],
      },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
