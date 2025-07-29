import classNames from 'classnames';

interface LoaderProps {
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({ size = 60 }: LoaderProps) => {
  const thickness = Math.max(size / 6, 4);

  return (
    <div
      data-testid="loader"
      className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 gap-2"
    >
      <div
        className={classNames(
          'rounded-full animate-spin border-gray-300 border-t-gray-500'
        )}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${thickness}px`,
        }}
      />
      <span className="text-gray-600 text-sm">Loading...</span>
    </div>
  );
};
