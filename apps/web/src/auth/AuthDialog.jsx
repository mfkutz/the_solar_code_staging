import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CountrySelect from '@/components/CountrySelect.jsx';
import PasswordInput from '@/components/PasswordInput.jsx';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';
import { api } from '@/lib/api.js';

export default function AuthDialog() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { authOpen, authMode, authRedirect, authHint, closeAuth, login, register } = useAuth();

  // 'email' → 'login' | 'register' | 'forgot' | 'forgot-sent'
  const [mode, setMode] = useState('email');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [emailLocked, setEmailLocked] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset each time the dialog opens.
  useEffect(() => {
    if (authOpen) {
      setMode(['login', 'register', 'forgot'].includes(authMode) ? authMode : 'email');
      setName('');
      setCountry('');
      setEmail('');
      setEmailLocked(false);
      setNewAccount(false);
      setPassword('');
      setError('');
      setSubmitting(false);
    }
  }, [authOpen, authMode]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'email') {
        const { exists } = await api.get(`/auth/check-email?email=${encodeURIComponent(email.trim())}`);
        setEmailLocked(true);
        setNewAccount(!exists);
        if (!exists && authHint?.name) setName(authHint.name);
        if (!exists && authHint?.country) setCountry(authHint.country);
        setMode(exists ? 'login' : 'register');
        return;
      }
      if (mode === 'forgot') {
        await api.post('/auth/forgot-password', { email });
        setMode('forgot-sent');
        return;
      }
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, name: name.trim() || undefined, country: country.trim() || undefined });
      }
      closeAuth();
      if (authRedirect) navigate(authRedirect);
    } catch (err) {
      setError(err?.message || t('auth.genericError'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetToEmail = () => {
    setEmailLocked(false);
    setNewAccount(false);
    setPassword('');
    setError('');
    setMode('email');
  };

  const a = t('auth');

  if (mode === 'forgot-sent') {
    return (
      <Dialog open={authOpen} onOpenChange={(open) => { if (!open) closeAuth(); }}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              {a.forgotSentTitle}
            </DialogTitle>
            <DialogDescription>{a.forgotSentDesc}</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground text-center mt-4">
            <button type="button" onClick={() => { setMode('login'); setError(''); }}
              className="text-primary font-medium hover:underline">
              {a.backToLogin}
            </button>
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const title = mode === 'email'    ? a.emailStepTitle
              : mode === 'forgot'   ? a.forgotTitle
              : mode === 'login'    ? a.loginTitle
              :                       a.registerTitle;

  const subtitle = mode === 'email'  ? a.emailStepSubtitle
                 : mode === 'forgot' ? a.forgotDesc
                 : mode === 'login'  ? a.loginSubtitle
                 :                    a.registerSubtitle;

  return (
    <Dialog open={authOpen} onOpenChange={(open) => { if (!open) closeAuth(); }}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            {title}
          </DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">

          {/* Name + country — only on register */}
          {mode === 'register' && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="auth-name">{a.name}</Label>
                <Input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={a.namePh}
                  autoComplete="name"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{a.country}</Label>
                <CountrySelect value={country} onChange={setCountry} />
              </div>
            </>
          )}

          {/* Email field — editable in 'email' and 'forgot', locked chip otherwise */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="auth-email">{a.email}</Label>
            {emailLocked ? (
              <div className="flex items-center justify-between rounded-md border border-input bg-muted px-3 py-2 text-sm">
                <span className="text-foreground">{email}</span>
                <button type="button" onClick={resetToEmail}
                  className="text-xs text-primary hover:underline ml-2 shrink-0">
                  {a.changeEmail}
                </button>
              </div>
            ) : (
              <Input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={a.emailPh}
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                autoFocus={mode === 'email' || (mode === 'login' && !emailLocked)}
              />
            )}
          </div>

          {/* Password — login, register, forgot */}
          {(mode === 'login' || mode === 'register') && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="auth-password">{a.password}</Label>
                {mode === 'login' && (
                  <button type="button" tabIndex={-1}
                    onClick={() => { setMode('forgot'); setEmailLocked(false); setError(''); }}
                    className="text-xs text-muted-foreground hover:text-primary hover:underline">
                    {a.forgotLink}
                  </button>
                )}
              </div>
              <PasswordInput
                id="auth-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={a.passwordPh}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                autoFocus={mode === 'login' && emailLocked}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          )}

          {/* "No account found" note */}
          {mode === 'register' && newAccount && (
            <p className="text-xs text-muted-foreground -mt-1">{a.newAccountNote}</p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {submitting
              ? (mode === 'email' ? a.checking : '…')
              : mode === 'email'    ? a.emailContinue
              : mode === 'forgot'   ? a.forgotSubmit
              : mode === 'login'    ? a.submitLogin
              :                       a.submitRegister}
          </Button>
        </form>

        {/* Footer links */}
        {(mode === 'login' || mode === 'register') && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            {mode === 'login' ? a.noAccount : a.haveAccount}{' '}
            <button type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setNewAccount(false); setError(''); }}
              className="text-primary font-medium hover:underline">
              {mode === 'login' ? a.switchToRegister : a.switchToLogin}
            </button>
          </p>
        )}

        {mode === 'forgot' && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            <button type="button" onClick={() => { setMode('email'); setError(''); }}
              className="text-primary font-medium hover:underline">
              {a.backToLogin}
            </button>
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
