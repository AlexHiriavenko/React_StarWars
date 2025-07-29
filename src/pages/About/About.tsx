const About = (): JSX.Element => {
  return (
    <div className="min-h-[calc(100vh-60px)] max-xs:min-h-[calc(100vh-63px)] bg-gradient-to-b from-gray-900 to-black text-white px-4 py-16 flex items-center max-xs:justify-start max-xs:pt-0 justify-center overflow-hidden">
      <div className="max-w-2xl w-full text-center bg-gray-800 bg-opacity-80 rounded-2xl shadow-xl p-10 backdrop-blur-md mb-28">
        <h1 className="text-4xl font-bold mb-6 text-accent">About This App</h1>
        <p className="text-lg mb-6">
          This application was developed as part of the{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline hover:text-white transition-colors"
          >
            React Course by RS School
          </a>
          .
        </p>

        <div className="text-left bg-gray-700 bg-opacity-50 rounded-xl p-6 space-y-4 shadow-inner">
          <p>
            <span className="font-semibold text-white">Author:</span> march
            (Alex Hiriavenko)
          </p>

          <p className="flex items-center gap-2">
            <span className="font-semibold text-white">GitHub:</span>
            <a
              href="https://github.com/AlexHiriavenko/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:underline"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.26.793-.577v-2.23c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.932 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.526.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.986-.4 3.005-.404 1.02.004 2.047.137 3.009.404 2.289-1.552 3.295-1.23 3.295-1.23.655 1.65.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.48 5.921.43.371.823 1.104.823 2.224v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"
                  clipRule="evenodd"
                />
              </svg>
              github.com/AlexHiriavenko
            </a>
          </p>

          <p className="flex items-center gap-2">
            <span className="font-semibold text-white">Email:</span>
            <a
              href="mailto:martmarchmartmarch@gmail.com"
              className="flex items-center gap-2 text-accent hover:underline"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M2.01 6.536A2 2 0 014 5h16a2 2 0 011.99 1.536L12 13.5 2.01 6.536z" />
                <path d="M2 8.25v9.5A2.25 2.25 0 004.25 20h15.5A2.25 2.25 0 0022 17.75v-9.5l-10 6.75L2 8.25z" />
              </svg>
              martmarchmartmarch@gmail.com
            </a>
          </p>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default About;
