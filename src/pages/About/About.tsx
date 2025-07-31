import { MailIcon, GitHubIcon } from '@/components/SWG-icons';

const About = (): JSX.Element => {
  return (
    <div
      className="
        min-h-[calc(100vh-60px)] max-xs:min-h-[calc(100vh-63px)]
        bg-gradient-to-b from-gray-200 to-gray-600
        dark:from-gray-900 dark:to-black
        text-black dark:text-white
        px-4 py-16 flex items-center max-xs:justify-start max-xs:pt-0 justify-center overflow-hidden
      "
    >
      <div
        className="
          max-w-2xl w-full text-center
          bg-white dark:bg-gray-800
          rounded-2xl shadow-xl p-10 mb-28
        "
      >
        <h1 className="text-4xl font-bold mb-6 text-accent">About This App</h1>

        <p className="text-lg mb-6">
          This application was developed as part of the{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline transition-colors"
          >
            React Course by RS School
          </a>
          .
        </p>

        <div
          className="
            text-left
            bg-gray-100 dark:bg-gray-700
            rounded-xl p-6 space-y-4 shadow-inner
          "
        >
          <p>
            <span className="font-semibold">Author:</span> march (Alex
            Hiriavenko)
          </p>

          <p className="flex items-center gap-2">
            <span className="font-semibold">GitHub:</span>
            <a
              href="https://github.com/AlexHiriavenko/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:underline"
            >
              <GitHubIcon className="w-5 h-5" />
              github.com/AlexHiriavenko
            </a>
          </p>

          <p className="flex items-center gap-2">
            <span className="font-semibold">Email:</span>
            <a
              href="mailto:martmarchmartmarch@gmail.com"
              className="flex items-center gap-2 text-accent hover:underline"
            >
              <MailIcon className="w-5 h-5" />
              martmarchmartmarch@gmail.com
            </a>
          </p>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default About;
