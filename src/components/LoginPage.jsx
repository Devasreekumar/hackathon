import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ShoppingBag } from 'lucide-react';

export function LoginPage({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaExpected, setCaptchaExpected] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const { login } = useAuth();
  const { t } = useLocale();

  // generate a small math captcha (fallback if no 3rd-party captcha configured)
  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let q = `${a} ${op} ${b}`;
    // evaluate
    // eslint-disable-next-line no-eval
    const expected = String(eval(q));
    setCaptchaQuestion(q + ' = ?');
    setCaptchaExpected(expected);
    setCaptchaValue('');
  };

  // initialize captcha on first render
  useState(() => { generateCaptcha(); return null; });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // simple client-side captcha validation
    if (String(captchaValue).trim() !== String(captchaExpected).trim()) {
      setError('CAPTCHA answer is incorrect. Please try again.');
      setLoading(false);
      generateCaptcha();
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <ShoppingBag className="size-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            {t('loginTitle')}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Simple math CAPTCHA (client-side) */}
            <div className="space-y-2">
              <Label htmlFor="captcha">Captcha: solve</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="captcha"
                  type="text"
                  placeholder={captchaQuestion}
                  value={captchaValue}
                  onChange={(e) => setCaptchaValue(e.target.value)}
                  required
                />
                <Button type="button" variant="ghost" onClick={generateCaptcha}>Refresh</Button>
              </div>
              <p className="text-sm text-muted-foreground">Enter the result of the expression shown in the placeholder.</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('signingIn') : t('signIn')}
            </Button>

            <p className="text-center">
              {t('dontHaveAccount')}{' '} <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {t('registerHere')}
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
