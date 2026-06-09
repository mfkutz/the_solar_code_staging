import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Sun, Sparkles, Zap, Wind, Droplet, Mountain, Flame, Circle, Heart, Brain, Leaf, Music, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SectionHeading from '@/components/SectionHeading.jsx';
import ElementCard from '@/components/ElementCard.jsx';
import ActivationCard from '@/components/ActivationCard.jsx';
import BirthForm from '@/components/BirthForm.jsx';
import SolarCodeOfDay from '@/components/SolarCodeOfDay.jsx';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { api } from '@/lib/api.js';
import { home } from '@/content/home.js';
import { elements as elementsContent } from '@/content/elements.js';

// Renders text with **double asterisks** turned into <strong>.
const Rich = ({ text, className }) => {
  const parts = String(text).split('**');
  return (
    <p className={className}>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </p>
  );
};

const ELEMENT_META = [
  { key: 'earth', color: '#8B4513', icon: Mountain },
  { key: 'water', color: '#4169E1', icon: Droplet },
  { key: 'air', color: '#87CEEB', icon: Wind },
  { key: 'fire', color: '#FF4500', icon: Flame },
  { key: 'ether', color: '#9370DB', icon: Circle },
];

const ACTIVATION_ICONS = [Wind, Brain, Sun, Leaf, Flame, Mountain, Music, Zap, Heart, Sparkles];

const ECOSYSTEM_LINKS = [
  { name: 'Game of Life', url: 'https://gameoflife.bingo' },
  { name: 'The Solar Code', url: 'https://thesolarcode.com' },
  { name: 'World Lider', url: 'https://worldlider.com' },
];

const HomePage = () => {
  const { lang } = useI18n();
  const c = home[lang];

  const [formData, setFormData] = useState({ name: '', email: '', country: '', birthdate: '', message: '' });
  const [joined, setJoined] = useState(false);
  const [bdParts, setBdParts] = useState({ d: '', m: '', y: '' });

  const handleBdChange = (part) => (e) => {
    const next = { ...bdParts, [part]: e.target.value };
    setBdParts(next);
    const { d, m, y } = next;
    const combined = y && m && d ? `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}` : '';
    setFormData((prev) => ({ ...prev, birthdate: combined }));
  };

  const elements = ELEMENT_META.map((m) => ({
    ...m,
    name: elementsContent[m.key][lang].name,
    meaning: elementsContent[m.key][lang].meaning,
  }));

  const activationPractices = c.activation.practices.map((p, i) => ({ ...p, icon: ACTIVATION_ICONS[i] }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error(c.join.errFill);
      return;
    }
    try {
      await api.post('/leads', formData);
      setJoined(true);
    } catch (err) {
      toast.error(err?.message || c.join.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>THE SOLAR CODE — Remember Your Frequency</title>
        <meta name="description" content="The Solar Code is a spiritual and symbolic system inspired by solar cosmology, Mayan time, Taoist wisdom and the 144,000 codes of light. Discover your frequency, activate your inner Sun and join the awakening." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero + Calculator — the calculator is the first thing visitors see */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1602407068433-750ee18e0211"
              alt="Cosmic solar background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background"></div>
          </div>

          <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16">
            {/* Day's energy ribbon — first thing seen, invites a daily return */}
            <motion.div
              className="max-w-lg mx-auto mb-8"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            >
              <SolarCodeOfDay variant="ribbon" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 text-glow" style={{ letterSpacing: '-0.02em' }}>
                THE SOLAR CODE
              </h1>
              <p className="text-xl md:text-2xl text-foreground mb-10 font-medium">{c.hero.subtitle}</p>
            </motion.div>

            <motion.div id="discover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <BirthForm />
            </motion.div>

            <button
              onClick={() => document.querySelector('#what-is')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-10 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {c.hero.btnBegin} ↓
            </button>
          </div>
        </section>

        {/* What Is The Solar Code */}
        <section id="what-is" className="py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.whatIs.title} subtitle={c.whatIs.subtitle} />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
              <div className="bg-card rounded-2xl p-8 md:p-12 border border-border/50 shadow-lg">
                <p className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>{c.whatIs.quote}</p>
                <div className="space-y-6 text-lg leading-relaxed">
                  <Rich text={c.whatIs.p1} />
                  <Rich text={c.whatIs.p2} />
                  <Rich text={c.whatIs.p3} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The 144,000 Solar Codes */}
        <section id="codes" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.codes.title} subtitle={c.codes.subtitle} />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
              <div className="bg-secondary rounded-2xl p-8 md:p-12 text-secondary-foreground shadow-lg cosmic-glow">
                <p className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>{c.codes.quote}</p>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p>{c.codes.p1}</p>
                  <p>{c.codes.p2}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    {c.codes.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <p>{c.codes.closing}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The 5 Universal Elements */}
        <section id="elements" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.elements.title} subtitle={c.elements.subtitle} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elements.map((element, index) => (
                <ElementCard key={element.key} element={element} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Natural Time vs Mechanical Time */}
        <section id="natural-time" className="py-24 bg-secondary text-secondary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.naturalTime.title} subtitle={c.naturalTime.subtitle} />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
              <div className="bg-card/10 rounded-2xl p-8 md:p-12 border border-primary/20">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>{c.naturalTime.quote}</p>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p>{c.naturalTime.p1}</p>
                  <Rich text={c.naturalTime.p2} />
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    {c.naturalTime.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <p>{c.naturalTime.p3}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Activation of The Solar Code */}
        <section id="activation" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.activation.title} subtitle={c.activation.subtitle} />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto mb-12">
              <div className="bg-card rounded-2xl p-8 border border-border/50 text-center">
                <p className="text-xl md:text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>{c.activation.quote}</p>
                <p className="text-muted-foreground leading-relaxed">{c.activation.p1}</p>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activationPractices.map((practice, index) => (
                <ActivationCard key={practice.name} practice={practice} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* The Golden Dragon Path */}
        <section id="dragon" className="py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.dragon.title} subtitle={c.dragon.subtitle} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <img
                  src="https://images.unsplash.com/photo-1644212054093-e5924f084240"
                  alt="Golden dragon representing solar transformation and inner fire"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <p className="text-2xl md:text-3xl font-bold text-primary mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>{c.dragon.quote}</p>
                <div className="space-y-4 text-lg leading-relaxed">
                  <p>{c.dragon.p1}</p>
                  <p>{c.dragon.listIntro}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    {c.dragon.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <p>{c.dragon.p2}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Solar Gates */}
        <section id="solar-gates" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.solarGates.title} subtitle={c.solarGates.subtitle} />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
              <div className="bg-card rounded-2xl p-8 md:p-12 border border-border/50 shadow-lg">
                <p className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>{c.solarGates.quote}</p>
                <div className="space-y-6 text-lg leading-relaxed">
                  <Rich text={c.solarGates.p1} />
                  <p>{c.solarGates.listIntro}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    {c.solarGates.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <p>{c.solarGates.p2}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Datong - The Great Harmony */}
        <section id="datong" className="py-24 bg-secondary text-secondary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.datong.title} subtitle={c.datong.subtitle} />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
              <div className="bg-card/10 rounded-2xl p-8 md:p-12 border border-primary/20">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>{c.datong.quote}</p>
                <div className="space-y-6 text-lg leading-relaxed">
                  <Rich text={c.datong.p1} />
                  <Rich text={c.datong.p2} />
                  <Rich text={c.datong.p3} />
                  <p>{c.datong.p4}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Join the 144,000 */}
        <section id="join" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.join.title} subtitle={c.join.subtitle} />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
              <div className="bg-card rounded-2xl p-8 md:p-12 border border-primary/30 shadow-lg cosmic-glow">
                {joined ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center py-8 gap-4"
                  >
                    <CheckCircle className="w-16 h-16 text-primary" />
                    <h3 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {c.join.successTitle}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{c.join.successBody}</p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-lg text-center mb-6 leading-relaxed">{c.join.intro}</p>
                    <ul className="flex flex-col gap-2 mb-8">
                      {c.join.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5">✦</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="join-name" className="text-foreground">{c.join.name} *</Label>
                        <Input id="join-name" name="name" type="text" required value={formData.name} onChange={handleInputChange}
                          className="mt-2 bg-input text-foreground placeholder:text-muted-foreground" placeholder={c.join.namePh} />
                      </div>
                      <div>
                        <Label htmlFor="join-email" className="text-foreground">{c.join.email} *</Label>
                        <Input id="join-email" name="email" type="email" required value={formData.email} onChange={handleInputChange}
                          className="mt-2 bg-input text-foreground placeholder:text-muted-foreground" placeholder={c.join.emailPh} />
                      </div>
                      <div>
                        <Label htmlFor="join-country" className="text-foreground">{c.join.country}</Label>
                        <Input id="join-country" name="country" type="text" value={formData.country} onChange={handleInputChange}
                          className="mt-2 bg-input text-foreground placeholder:text-muted-foreground" placeholder={c.join.countryPh} />
                      </div>
                      <div>
                        <Label className="text-foreground">{c.join.birthdate}</Label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <select value={bdParts.d} onChange={handleBdChange('d')}
                            className="bg-input text-foreground border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            <option value="">{c.join.bdDay}</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <option key={d} value={String(d)}>{d}</option>
                            ))}
                          </select>
                          <select value={bdParts.m} onChange={handleBdChange('m')}
                            className="bg-input text-foreground border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            <option value="">{c.join.bdMonth}</option>
                            {c.join.months.map((name, i) => (
                              <option key={i} value={String(i + 1)}>{name}</option>
                            ))}
                          </select>
                          <select value={bdParts.y} onChange={handleBdChange('y')}
                            className="bg-input text-foreground border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            <option value="">{c.join.bdYear}</option>
                            {Array.from({ length: new Date().getFullYear() - 1929 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                              <option key={y} value={String(y)}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="join-message" className="text-foreground">{c.join.message}</Label>
                        <Textarea id="join-message" name="message" rows={4} value={formData.message} onChange={handleInputChange}
                          className="mt-2 bg-input text-foreground placeholder:text-muted-foreground" placeholder={c.join.messagePh} />
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.98]">
                        {c.join.submit}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ecosystem Connection */}
        <section id="ecosystem" className="py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
              <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
              <p className="text-2xl md:text-3xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>{c.ecosystem.quote}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {ECOSYSTEM_LINKS.map((link) => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:-translate-y-1">
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Closing Section */}
        <section id="closing" className="py-24 bg-gradient-to-b from-background to-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
              <Sun className="w-24 h-24 text-primary mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8" style={{ letterSpacing: '-0.02em', fontFamily: 'Playfair Display, serif' }}>
                {c.closing.heading}
              </h2>
              <div className="space-y-6 text-xl leading-relaxed mb-12">
                {c.closing.lines.map((line, i) => <p key={i}>{line}</p>)}
              </div>
              <Button size="lg" className="text-lg px-12 py-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.98]"
                onClick={() => document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' })}>
                {c.closing.button}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
