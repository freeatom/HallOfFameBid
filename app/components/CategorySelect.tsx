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
}: {
  categories: string[];
  initialCategory?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(
    initialCategory && categories.includes(initialCategory) ? initialCategory : categories[0],
  );
  const ref = useRef<HTMLDivElement>(null);
  const SelectedIcon = icons[selected] ?? Shapes;

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <div className="category-select" ref={ref}>
      <input type="hidden" name="category" value={selected} />
      <button
        type="button"
        className="category-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <SelectedIcon aria-hidden="true" />
        <span>{selected}</span>
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
                onClick={() => {
                  setSelected(category);
                  setOpen(false);
                }}
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
