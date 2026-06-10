import React, { useState } from 'react';
import { ChevronDown, History, LogOut, Menu, Sparkles, Sun, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const { user, loading, logout, openAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation is organized into two dropdown groups plus a couple of standalone
  // entries, so the bar stays uncluttered and "Informes" reads as the CTA.
  const home = { label: t('nav.home'), href: '#home' };
  const discover = { label: t('nav.discover'), href: '#discover' };
  const reports = { label: t('nav.reports'), to: '/reports' };
  const groups = [
    {
      label: t('nav.theCode'),
      items: [
        { label: t('nav.whatIs'), href: '#what-is' },
        { label: t('nav.codes'), href: '#codes' },
        { label: t('nav.elements'), href: '#elements' },
        { label: t('nav.activation'), href: '#activation' },
      ],
    },
    {
      label: t('nav.movement'),
      items: [
        { label: t('nav.dragon'), href: '#dragon' },
        { label: t('nav.datong'), href: '#datong' },
        { label: t('nav.join'), href: '#join' },
      ],
    },
  ];

  const handleNavClick = (item) => {
    setIsOpen(false);
    // Route links (e.g. /reports) navigate directly.
    if (typeof item === 'object' && item.to) {
      navigate(item.to);
      return;
    }
    const href = typeof item === 'object' ? item.href : item;
    // Anchor sections only exist on the homepage; route home first if elsewhere.
    if (location.pathname !== '/') {
      navigate(`/${href}`);
      return;
    }
    // The discover form lives at the top of the hero, so scroll to the very top
    // (showing the title + form together) instead of jumping down to the form.
    if (href === '#discover' || href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const navLinkClass =
    'px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 rounded-lg hover:bg-muted';

  // Desktop account control: "Log in" when signed out, a user menu when signed in.
  const AuthControl = () => {
    if (loading) return null;
    if (!user) {
      return (
        <Button
          onClick={() => openAuth('login')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
        >
          {t('nav.login')}
        </Button>
      );
    }
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className={`${navLinkClass} inline-flex items-center gap-2 outline-none data-[state=open]:text-primary data-[state=open]:bg-muted`}>
          <User className="w-4 h-4" />
          <span className="max-w-[12ch] truncate">{user.name || user.email}</span>
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card border-border">
          <DropdownMenuItem
            onClick={() => navigate('/dashboard')}
            className="cursor-pointer text-muted-foreground focus:text-primary focus:bg-muted"
          >
            <Sparkles className="w-4 h-4 mr-2" /> {t('nav.myCode')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => { logout(); navigate('/'); }}
            className="cursor-pointer text-muted-foreground focus:text-primary focus:bg-muted"
          >
            <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 gap-4">
          {/* Left: logo */}
          <div className="flex-1 flex items-center">
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
          </div>

          {/* Center: desktop navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {/* "El Código" dropdown */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className={`${navLinkClass} inline-flex items-center gap-1 outline-none data-[state=open]:text-primary data-[state=open]:bg-muted`}>
                {groups[0].label}
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-card border-border">
                {groups[0].items.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    onClick={() => handleNavClick(item)}
                    className="cursor-pointer text-muted-foreground focus:text-primary focus:bg-muted"
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Standalone: Descubre tu Código */}
            <a
              href={discover.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(discover); }}
              className={navLinkClass}
            >
              {discover.label}
            </a>

            {/* "Movimiento" dropdown */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className={`${navLinkClass} inline-flex items-center gap-1 outline-none data-[state=open]:text-primary data-[state=open]:bg-muted`}>
                {groups[1].label}
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-card border-border">
                {groups[1].items.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    onClick={() => handleNavClick(item)}
                    className="cursor-pointer text-muted-foreground focus:text-primary focus:bg-muted"
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Highlighted CTA: Informes */}
            <Button
              onClick={() => handleNavClick(reports)}
              className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {reports.label}
            </Button>
          </nav>

          {/* Right: language toggle (desktop) + mobile controls */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <div className="hidden lg:flex items-center gap-2">
              <LangToggle />
              <AuthControl />
            </div>
            <div className="flex items-center gap-2 lg:hidden">
            <LangToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card border-border overflow-y-auto">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <div className="flex flex-col gap-2 mt-8">
                  <a
                    href={home.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(home); }}
                    className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-200"
                  >
                    {home.label}
                  </a>

                  <Accordion type="multiple" className="w-full">
                    {groups.map((group) => (
                      <AccordionItem key={group.label} value={group.label} className="border-border/50">
                        <AccordionTrigger className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:no-underline">
                          {group.label}
                        </AccordionTrigger>
                        <AccordionContent className="pb-1">
                          <div className="flex flex-col">
                            {group.items.map((item) => (
                              <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
                                className="pl-8 pr-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-200"
                              >
                                {item.label}
                              </a>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <a
                    href={discover.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(discover); }}
                    className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-200"
                  >
                    {discover.label}
                  </a>

                  <Button
                    onClick={() => handleNavClick(reports)}
                    className="mt-3 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {reports.label}
                  </Button>

                  {/* Account (mobile) */}
                  {!loading && (
                    <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-1">
                      {!user ? (
                        <Button
                          variant="outline"
                          onClick={() => { setIsOpen(false); openAuth('login'); }}
                          className="w-full justify-center"
                        >
                          {t('nav.login')}
                        </Button>
                      ) : (
                        <>
                          <span className="px-4 py-2 text-sm text-muted-foreground truncate">
                            {user.name || user.email}
                          </span>
                          <a
                            href="/dashboard"
                            onClick={(e) => { e.preventDefault(); setIsOpen(false); navigate('/dashboard'); }}
                            className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-200 inline-flex items-center"
                          >
                            <Sparkles className="w-4 h-4 mr-2" /> {t('nav.myCode')}
                          </a>
                          <button
                            onClick={() => { setIsOpen(false); logout(); navigate('/'); }}
                            className="text-left px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-200 inline-flex items-center"
                          >
                            <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
