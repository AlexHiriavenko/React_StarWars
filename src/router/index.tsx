import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Loader } from '@/components/baseComponents';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export default function AppRouter(): ReactElement {
  return (
    <Suspense fallback={<Loader size={100} color="white" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
