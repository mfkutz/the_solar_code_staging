import React, { useState } from 'react';
import { Menu, Sun } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider.jsx';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.whatIs'), href: '#what-is' },
    { label: t('nav.codes'), href: '#codes' },
    { label: t('nav.discover'), href: '#discover' },
    { label: t('nav.elements'), href: '#elements' },
    { label: t('nav.activation'), href: '#activation' },
    { label: t('nav.dragon'), href: '#dragon' },
    { label: t('nav.datong'), href: '#datong' },
    { label: t('nav.join'), href: '#join' }
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    // Anchor sections only exist on the homepage; route home first if elsewhere.
    if (location.pathname !== '/') {
      navigate(`/${href}`);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const LangToggle = () => (
    <div className="flex items-center rounded-lg border border-border/60 overflow-hidden text-sm">
      {['es', 'en'].map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-3 py-1 font-medium transition-colors ${lang === code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className="flex items-center gap-3 group"
          >
            <Sun className="w-8 h-8 text-primary transition-transform duration-300 group-hover:rotate-90" />
            <span className="text-xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              THE SOLAR CODE
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 rounded-lg hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
            <div className="ml-2"><LangToggle /></div>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <LangToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card border-border">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                      className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;