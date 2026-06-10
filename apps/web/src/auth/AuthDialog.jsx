import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CountrySelect from '@/components/CountrySelect.jsx';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';
import { api } from '@/lib/api.js';

// Single dialog with a login/register toggle. Controlled by AuthProvider so it
// can be opened from the header or the "save your reading" prompt.
export default function AuthDialog() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { authOpen, authMode, authRedirect, closeAuth, login, register } = useAuth();

  const [mode, setMode] = useState(authMode); // 'login' | 'register' | 'forgot' | 'forgot-sent'
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset to the requested mode and clear fields each time the dialog opens.
  useEffect(() => {
    if (authOpen) {
      setMode(authMode);
      setName('');
      setCountry('');
      setEmail('');
      setPassword('');
      setError('');
      setSubmitting(false);
    }
  }, [authOpen, authMode]);

  const isLogin = mode === 'login';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'forgot') {
        await api.post('/auth/forgot-password', { email });
        setMode('forgot-sent');
        return;
      }
      if (isLogin) await login(email, password);
      else await register({ email, password, name: name.trim() || undefined, country: country.trim() || undefined });
      closeAuth();
      if (authRedirect) navigate(authRedirect);
    } catch (err) {
      setError(err?.message || t('auth.genericError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'forgot-sent') {
    return (
      <Dialog open={authOpen} onOpenChange={(open) => { if (!open) closeAuth(); }}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('auth.forgotSentTitle')}
            </DialogTitle>
            <DialogDescription>{t('auth.forgotSentDesc')}</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground text-center mt-4">
            <button type="button" onClick={() => { setMode('login'); setError(''); }}
              className="text-primary font-medium hover:underline">
              {t('auth.backToLogin')}
            </button>
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={authOpen} onOpenChange={(open) => { if (!open) closeAuth(); }}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            {mode === 'forgot' ? t('auth.forgotTitle') : isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'forgot' ? t('auth.forgotDesc') : isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
          {mode !== 'forgot' && !isLogin && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="auth-name">{t('auth.name')}</Label>
                <Input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('auth.namePh')}
                  autoComplete="name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('auth.country')}</Label>
                <CountrySelect value={country} onChange={setCountry} />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="auth-email">{t('auth.email')}</Label>
            <Input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPh')}
              autoComplete="email"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="auth-password">{t('auth.password')}</Label>
                {isLogin && (
                  <button type="button" tabIndex={-1} onClick={() => { setMode('forgot'); setError(''); }}
                    className="text-xs text-muted-foreground hover:text-primary hover:underline">
                    {t('auth.forgotLink')}
                  </button>
                )}
              </div>
              <Input
                id="auth-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPh')}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {submitting
              ? '...'
              : mode === 'forgot'
                ? t('auth.forgotSubmit')
                : isLogin ? t('auth.submitLogin') : t('auth.submitRegister')}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-2">
          {mode === 'forgot' ? (
            <button type="button" onClick={() => { setMode('login'); setError(''); }}
              className="text-primary font-medium hover:underline">
              {t('auth.backToLogin')}
            </button>
          ) : (
            <>
              {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
              <button type="button"
                onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); }}
                className="text-primary font-medium hover:underline">
                {isLogin ? t('auth.switchToRegister') : t('auth.switchToLogin')}
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
