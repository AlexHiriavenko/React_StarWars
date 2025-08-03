import { Provider } from 'react-redux';
import { ThemeProvider } from '@/components/ThemeContext/ThemeProvider';
import { store } from '@/redux/store';

interface Props {
  children: React.ReactNode;
}

export const TestProviders = ({ children }: Props): JSX.Element => (
  <ThemeProvider>
    <Provider store={store}>{children}</Provider>
  </ThemeProvider>
);
