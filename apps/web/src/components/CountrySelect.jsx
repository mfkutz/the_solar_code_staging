import React, { useState, useMemo } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from '@/components/ui/command';
import { countries } from '@/content/countries.js';
import { useI18n } from '@/i18n/I18nProvider.jsx';

// value = English country name (stable DB key)
// onChange(englishName) — called when user picks a country
export default function CountrySelect({ value, onChange, placeholder }) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => countries.find((c) => c.en === value),
    [value]
  );

  const label = placeholder || (lang === 'es' ? 'Seleccioná tu país' : 'Select your country');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-input border-input text-foreground font-normal hover:bg-input/80 h-10"
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <span className="text-lg leading-none">{selected.flag}</span>
              <span>{selected[lang] ?? selected.en}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{label}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-card border-border" align="start">
        <Command>
          <CommandInput
            placeholder={lang === 'es' ? 'Buscar país…' : 'Search country…'}
            className="h-9"
          />
          <CommandList className="max-h-60">
            <CommandEmpty>{lang === 'es' ? 'País no encontrado.' : 'No country found.'}</CommandEmpty>
            {countries.map((c) => (
              <CommandItem
                key={c.code}
                value={`${c.en} ${c.es}`}
                onSelect={() => { onChange(c.en); setOpen(false); }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="text-lg leading-none">{c.flag}</span>
                <span>{c[lang] ?? c.en}</span>
                {value === c.en && <Check className="ml-auto h-4 w-4 text-primary" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
