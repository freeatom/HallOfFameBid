'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  BriefcaseBusiness,
  Check,
  CodeXml,
  Compass,
  Earth,
  Gamepad2,
  GraduationCap,
  Handshake,
  HeartPulse,
  House,
  ListTodo,
  MapPinned,
  Megaphone,
  MicVocal,
  Newspaper,
  Palette,
  PenLine,
  Scale,
  SearchCheck,
  Share2,
  Shapes,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Bitcoin,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  Overall: Trophy,
  'AI Agents & Infrastructure': Bot,
  'SEO & AI Visibility': SearchCheck,
  'Marketing & Advertising': Megaphone,
  'Crypto, Web3 & Investing': Bitcoin,
  'Developer Tools': CodeXml,
  'Business, Finance & Legal': Scale,
  'Security, Privacy & Compliance': ShieldCheck,
  'Health, Fitness & Wellness': HeartPulse,
  'Social Media & Creator Tools': Share2,
  'Leaderboards & Attention Markets': Trophy,
  'Hiring, Jobs & Careers': BriefcaseBusiness,
  'Education & Learning': GraduationCap,
  'Agencies, Studios & Services': Handshake,
  'Ecommerce & Retail': ShoppingCart,
  'Domains & Web Assets': Earth,
  'Games & Entertainment': Gamepad2,
  'People & Profiles': UserRound,
  'Productivity & Personal Tools': ListTodo,
  'Design & Creative': Palette,
  'Writing & Content': PenLine,
  'Directories, Launch & Discovery': Compass,
  'AI Media Generation': Sparkles,
  'Audio, Voice & Podcasting': MicVocal,
  'Sales & Lead Generation': Target,
  'Travel, Local & Lifestyle': MapPinned,
  'Real Estate & Property': House,
  'Media & News': Newspaper,
  Other: Shapes,
};

export function CategorySelect({
  categories,
  initialCategory,
  name = 'category',
  placeholder = 'Choose category',
  value,
  onChange,
}: {
  categories: string[];
  initialCategory?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (category: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(
    initialCategory && categories.includes(initialCategory) ? initialCategory : '',
  );
  const selected = value && categories.includes(value) ? value : internalSelected;
  const label = selected || placeholder;
  const ref = useRef<HTMLDivElement>(null);
  const SelectedIcon = selected ? icons[selected] ?? Shapes : Shapes;

  function choose(category: string) {
    setInternalSelected(category);
    onChange?.(category);
    setOpen(false);
  }

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <div className="category-select" ref={ref}>
      <input type="hidden" name={name} value={selected} />
      <button
        type="button"
        className="category-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <SelectedIcon aria-hidden="true" />
        <span className={selected ? undefined : 'category-placeholder'}>{label}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {open ? (
        <div className="category-menu" role="listbox" aria-label="Select category">
          {categories.map((category) => {
            const Icon = icons[category] ?? Shapes;
            const active = category === selected;
            return (
              <button
                type="button"
                role="option"
                aria-selected={active}
                className={active ? 'category-option active' : 'category-option'}
                key={category}
                onClick={() => choose(category)}
              >
                <Icon aria-hidden="true" />
                <span>{category}</span>
                {active ? <Check aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
