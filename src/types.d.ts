import type { JSX, PropsWithChildren, ReactNode, ErrorInfo } from 'react';

// чтобы не писать каждый раз в компонентах import type делаем некоторые типы доступными глобально;
declare global {
  export { JSX, PropsWithChildren, ReactNode, ErrorInfo };
}
