import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/router/routes';

const router = createBrowserRouter(routes);

function AppRouter(): ReactElement {
  return (
    <Suspense fallback={<div>...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export { AppRouter };
