import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ui } from './ui.js';

const I18nContext = createContext(null);

const SUPPORTED = ['es', 'en'];
const STORAGE_KEY = 'solarCodeLang';

function detectInitialLang() {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const browser = (window.navigator.language || 'en').toLowerCase();
  return browser.startsWith('es') ? 'es' : 'en';
}

// Resolve a dotted key path ("form.name") against the strings object.
function resolve(obj, path) {
  return path.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), obj);
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (SUPPORTED.includes(next)) setLangState(next);
  }, []);

  const t = useCallback(
    (key, fallback) => {
      const value = resolve(ui[lang], key);
      if (value != null) return value;
      const enValue = resolve(ui.en, key);
      return enValue != null ? enValue : (fallback != null ? fallback : key);
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t, supported: SUPPORTED }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
  return ctx;
}
