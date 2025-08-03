const MailIcon = ({
  className = 'w-5 h-5',
}: {
  className?: string;
}): JSX.Element => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M2.01 6.536A2 2 0 014 5h16a2 2 0 011.99 1.536L12 13.5 2.01 6.536z" />
    <path d="M2 8.25v9.5A2.25 2.25 0 004.25 20h15.5A2.25 2.25 0 0022 17.75v-9.5l-10 6.75L2 8.25z" />
  </svg>
);

export { MailIcon };
