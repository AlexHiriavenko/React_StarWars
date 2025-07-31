import { useTheme } from '@/hooks';

const ThemeSwitcher = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="switch-theme__label" title="Display Mode">
      <input
        className="switch-theme__input"
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      <span className="switch-theme__span"></span>
    </label>
  );
};

export { ThemeSwitcher };
