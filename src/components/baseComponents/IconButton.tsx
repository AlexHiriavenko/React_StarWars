interface IconButtonProps {
  icon: ReactNode;
  size?: number;
  top?: number;
  right?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

const IconButton = ({
  icon,
  size = 30,
  top = 8,
  right = 8,
  onClick,
  ariaLabel = 'icon button',
}: IconButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="absolute flex items-center justify-center p-0 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}px`,
        right: `${right}px`,
      }}
    >
      {icon}
    </button>
  );
};

export { IconButton };
