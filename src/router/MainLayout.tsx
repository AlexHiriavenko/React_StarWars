import { Outlet, Link, useLocation } from 'react-router-dom';

export function MainLayout(): JSX.Element {
  const location = useLocation();

  return (
    <>
      <header className="w-full py-3 bg-background text-base min-h-[64px] flex justify-around items-center overflow-x-hidden mb-5 flex-wrap gap-3 fixed z-50">
        <h1 className="text-[42px] max-xs:text-[36px] font-normal text-center font-title custom-title-effect">
          Star Wars
        </h1>

        <nav className="flex gap-4 text-foreground text-lg font-light">
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

      {/* Контейнер с фоном-видео */}
      <div className="relative video-wrapper mt-[60px] min-h-[calc(100vh-60px)] max-xs:min-h-[calc(100vh-63px)] overflow-hidden max-xxs:mt-[70px]">
        {/* Видеофон */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source src="/videos/bg.mp4" type="video/mp4" />
        </video>

        {/* Основной контент */}
        <main className="relative z-10 text-white">
          <Outlet />
        </main>
      </div>
    </>
  );
}
