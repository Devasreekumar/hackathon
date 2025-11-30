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
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-red-50'}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-200 ${theme === 'dark' ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-orange-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-orange-700'}`}>{title}</h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Welcome, {user?.name || 'User'}</p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={locale} 
                onChange={(e) => setLocale(e.target.value)} 
                style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold border-2 transition-all ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 hover:border-orange-700' : 'bg-white text-gray-900 border-orange-200 hover:border-orange-400'} cursor-pointer`}
              >
                <option value="en" style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>EN</option>
                <option value="hi" style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>HI</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`${theme === 'dark' ? 'text-yellow-400 hover:bg-gray-800' : 'text-orange-600 hover:bg-orange-100'}`}
              >
                {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </Button>
              <Button 
                variant="outline" 
                onClick={logout} 
                className={`${theme === 'dark' ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-orange-200 text-orange-700 hover:bg-red-50'}`}
              >
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
