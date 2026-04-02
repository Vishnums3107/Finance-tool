import type { ThemeMode } from '../store/useUiPreferencesStore'

interface ThemeToggleProps {
  themeMode: ThemeMode
  onToggle: () => void
}

export const ThemeToggle = ({ themeMode, onToggle }: ThemeToggleProps) => {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle color theme"
      title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span className="theme-toggle-dot" aria-hidden />
      <span>{themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  )
}
