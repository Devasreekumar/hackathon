import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale } from '../contexts/LocaleContext';
import { Button } from './ui/button';
import { LogOut, Moon, Sun } from 'lucide-react';
export function DashboardLayout({ children, title }) {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-gray-900 dark:text-white">{title}</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={locale} 
                onChange={(e) => setLocale(e.target.value)} 
                style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                className="rounded-md px-2 py-1 text-sm border bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 cursor-pointer"
              >
                <option value="en" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>EN</option>
                <option value="hi" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>HI</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="size-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
