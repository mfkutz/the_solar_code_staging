import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, CalendarIcon } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect.jsx';
import { es as esLocale, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider.jsx';

const MIN_YEAR = 1920;

// Build a Date from an ISO 'YYYY-MM-DD' string using *local* time (avoids the
// UTC off-by-one-day shift in negative timezones).
function parseISO(iso) {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

// Serialize a local Date back to 'YYYY-MM-DD' without timezone conversion.
function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const BirthForm = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [data, setData] = useState({ name: '', birthdate: '', time: '', country: '', city: '' });
  const [calOpen, setCalOpen] = useState(false);

  const today = new Date();
  const dateLocale = lang === 'es' ? esLocale : enUS;
  const selectedDate = parseISO(data.birthdate);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    setData((prev) => ({ ...prev, birthdate: toISO(date) }));
    setCalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.birthdate) {
      toast.error(t('form.errorBirthdate'));
      return;
    }
    const params = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    navigate(`/code?${params.toString()}`);
  };

  return (
    <div className="bg-card rounded-2xl p-8 md:p-12 border border-primary/30 shadow-lg max-w-2xl lg:max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <Sun className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">{t('form.title')}</h3>
        <p className="text-muted-foreground">{t('form.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Label htmlFor="name">{t('form.name')}</Label>
          <Input id="name" name="name" value={data.name} onChange={handleChange}
            className="mt-2 bg-input" placeholder={t('form.namePh')} />
        </div>

        <div>
          <Label htmlFor="birthdate">{t('form.birthdate')} *</Label>
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <Button
                id="birthdate"
                type="button"
                variant="outline"
                className={cn(
                  'mt-2 w-full justify-start bg-input font-normal',
                  !selectedDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? selectedDate.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                  : t('form.birthdatePh')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                locale={dateLocale}
                selected={selectedDate}
                onSelect={handleDateSelect}
                defaultMonth={selectedDate || new Date(2000, 0)}
                startMonth={new Date(MIN_YEAR, 0)}
                endMonth={today}
                disabled={{ after: today }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="time">
            {t('form.time')} <span className="text-muted-foreground font-normal">({t('common.optional')})</span>
          </Label>
          <Input id="time" name="time" type="time" value={data.time} onChange={handleChange}
            className="mt-2 bg-input" />
          <p className="text-xs text-muted-foreground mt-1">{t('form.timeHint')}</p>
        </div>

        <div>
          <Label>{t('form.country')}</Label>
          <div className="mt-2">
            <CountrySelect
              value={data.country}
              onChange={(val) => setData((prev) => ({ ...prev, country: val }))}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="city">{t('form.city')}</Label>
          <Input id="city" name="city" value={data.city} onChange={handleChange}
            className="mt-2 bg-input" placeholder={t('form.cityPh')} />
        </div>

        <Button type="submit" size="lg"
          className="md:col-span-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.98]">
          {t('form.submit')}
        </Button>
      </form>
    </div>
  );
};

export default BirthForm;
