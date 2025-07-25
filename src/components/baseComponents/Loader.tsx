import React, { useId } from 'react';

interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 80, color = '#FF156D' }) => {
  const gradientId = useId();

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label="Loading"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <radialGradient
          id={gradientId}
          cx=".66"
          fx=".66"
          cy=".3125"
          fy=".3125"
          gradientTransform="scale(1.5)"
        >
          <stop offset="0" stopColor={color} />
          <stop offset=".3" stopColor={color} stopOpacity=".9" />
          <stop offset=".6" stopColor={color} stopOpacity=".6" />
          <stop offset=".8" stopColor={color} stopOpacity=".3" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>

        <circle
          style={{ transformOrigin: 'center' }}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="15"
          strokeLinecap="round"
          strokeDasharray="200 1000"
          strokeDashoffset="0"
          cx="100"
          cy="100"
          r="70"
        >
          <animateTransform
            type="rotate"
            attributeName="transform"
            calcMode="spline"
            dur="2"
            values="360;0"
            keyTimes="0;1"
            keySplines="0 0 1 1"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          style={{ transformOrigin: 'center' }}
          fill="none"
          opacity=".2"
          stroke={color}
          strokeWidth="15"
          strokeLinecap="round"
          cx="100"
          cy="100"
          r="70"
        />
      </svg>
    </div>
  );
};

export { Loader };
