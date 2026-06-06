import React, { useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { es as esLocale, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/I18nProvider.jsx';

const MIN_YEAR = 1920;

function parseISO(iso) {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}
function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// One person's birth fields, used by the relational (Couple/Family/Team) forms.
const PersonFields = ({ index, person, onChange, onRemove, label }) => {
  const { t, lang } = useI18n();
  const [calOpen, setCalOpen] = useState(false);
  const today = new Date();
  const dateLocale = lang === 'es' ? esLocale : enUS;
  const selectedDate = parseISO(person.birthdate);

  return (
    <div className="bg-muted/50 rounded-2xl p-6 border border-border/50 relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-primary">{label}</h4>
        {onRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}
            className="text-muted-foreground hover:text-destructive h-8 px-2">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`name-${index}`}>{t('form.name')}</Label>
          <Input id={`name-${index}`} value={person.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="mt-2 bg-input" placeholder={t('form.namePh')} />
        </div>

        <div>
          <Label htmlFor={`birthdate-${index}`}>{t('form.birthdate')} *</Label>
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <Button id={`birthdate-${index}`} type="button" variant="outline"
                className={cn('mt-2 w-full justify-start bg-input font-normal', !selectedDate && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? selectedDate.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                  : t('form.birthdatePh')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" captionLayout="dropdown" locale={dateLocale}
                selected={selectedDate}
                onSelect={(date) => { if (date) { onChange('birthdate', toISO(date)); setCalOpen(false); } }}
                defaultMonth={selectedDate || new Date(2000, 0)}
                startMonth={new Date(MIN_YEAR, 0)} endMonth={today}
                disabled={{ after: today }} autoFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`time-${index}`}>
              {t('form.time')} <span className="text-muted-foreground font-normal">({t('common.optional')})</span>
            </Label>
            <Input id={`time-${index}`} type="time" value={person.time}
              onChange={(e) => onChange('time', e.target.value)} className="mt-2 bg-input" />
          </div>
          <div>
            <Label htmlFor={`city-${index}`}>{t('form.city')}</Label>
            <Input id={`city-${index}`} value={person.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="mt-2 bg-input" placeholder={t('form.cityPh')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { PersonFields, parseISO, toISO };
export default PersonFields;
