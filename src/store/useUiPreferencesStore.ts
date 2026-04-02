import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'

interface UiPreferencesStore {
  themeMode: ThemeMode
  setThemeMode: (themeMode: ThemeMode) => void
  toggleThemeMode: () => void
}

export const useUiPreferencesStore = create<UiPreferencesStore>()(
  persist(
    (set) => ({
      themeMode: 'light',
      setThemeMode: (themeMode) => {
        set(() => ({ themeMode }))
      },
      toggleThemeMode: () => {
        set((state) => ({
          themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        }))
      },
    }),
    {
      name: 'finance-dashboard-ui-preferences-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
