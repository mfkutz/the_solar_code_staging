import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, ExternalLink, BookOpen } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { APP_VERSION, APP_COMMIT, BUILD_DATE } from '@/config/version.js';

const Footer = () => {
  const { t } = useI18n();
  const ecosystemLinks = [
    { name: 'Game of Life', url: 'https://gameoflife.bingo' },
    { name: 'The Solar Code', url: 'https://thesolarcode.com' },
    { name: 'World Lider', url: 'https://worldlider.com' }
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                THE SOLAR CODE
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">{t('footer.ecosystem')}</h3>
            <ul className="space-y-2">
              {ecosystemLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200 inline-flex items-center gap-2"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">{t('footer.connect')}</h3>
            <p className="text-sm leading-relaxed opacity-80 mb-4">
              {t('footer.connectText')}
            </p>
            <a
              href="https://amzn.eu/d/0dOo50Kg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/40 rounded-full px-4 py-2 hover:bg-primary/10 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              {t('footer.bookCta')}
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <p className="text-xs opacity-60 mt-2">{t('footer.bookNote')}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} The Solar Code. {t('footer.rights')}
          </p>
          <div className="flex gap-6">
            <Link to="/privacidad" className="text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all duration-200">
              {t('footer.privacy')}
            </Link>
            <Link to="/terminos" className="text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all duration-200">
              {t('footer.terms')}
            </Link>
          </div>
        </div>

        {/* Build / version stamp — lets technical visitors see what's deployed. */}
        <p className="mt-6 text-center text-xs opacity-40 font-mono">
          v{APP_VERSION} · {BUILD_DATE} · {APP_COMMIT}
        </p>
      </div>
    </footer>
  );
};

export default Footer;