import React from 'react';

interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 80, color = '#FF156D' }) => {
  const strokeWidth = 15;
  const radius = 70;
  const dashArray = 200;
  const dashOffset = 0;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label="Loading"
    >
      <svg
        viewBox="0 0 200 200"
        style={{
          width: '100%',
          height: '100%',
          animation: 'spin 1.5s linear infinite',
        }}
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeOpacity={1}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.2}
        />
      </svg>
    </div>
  );
};

export { Loader };
