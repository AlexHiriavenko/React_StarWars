import { Outlet, Link, useLocation } from 'react-router-dom';

export default function MainLayout(): JSX.Element {
  const location = useLocation();

  return (
    <>
      <header className="w-full py-3 bg-black text-base min-h-[64px] flex justify-around items-center overflow-x-hidden mb-5 flex-wrap gap-3 fixed z-50">
        <h1 className="text-[42px] max-xs:text-[36px] font-normal text-center font-title custom-title-effect">
          Star Wars
        </h1>

        <nav className="flex gap-4 text-white text-lg font-light">
          <Link
            to="/"
            className={location.pathname === '/' ? 'text-accent' : ''}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={location.pathname === '/about' ? 'text-accent' : ''}
          >
            About
          </Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
