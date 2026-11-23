import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { profileOutline } from '../geometry';

export const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>;

/** Shorthand for inline custom properties. */
export const vars = (v: Record<string, string>) => v as CSSProperties;

/** Text split into words and characters so each can be animated. Give the parent an aria-label. */
export function Split({ text, from = 0 }: { text: string; from?: number }) {
  let i = from;
  const words = text.split(' ');
  return (
    <span aria-hidden="true">
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="w">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className="ch" style={vars({ '--i': String(i++) })}><span>{ch}</span></span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}

export const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface ButtonProps { href: string; children: ReactNode; external?: boolean; variant?: 'solid' | 'line'; down?: boolean; small?: ReactNode }

/** Pill link with a fill that rises on hover and an arrow that swaps. */
export function Button({ href, children, external, variant = 'solid', down, small }: ButtonProps) {
  return (
    <a className={`btn ${variant}${down ? ' down' : ''}`} href={href} data-magnetic {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
      <span className="btn-label">{children}{small && <small>{small}</small>}</span>
      <span className="btn-ico" aria-hidden="true"><ArrowIcon /><ArrowIcon /></span>
    </a>
  );
}

export const finishes = [
  { id: 'mill', label: 'Mill' },
  { id: 'anodised', label: 'Anodised' },
  { id: 'powder', label: 'Powder-coated' },
  { id: 'wood', label: 'Wood finish' },
] as const;
export type Finish = (typeof finishes)[number]['id'];

/** Filled 40 × 40 mm T-slot section. `finish` picks the surface; `uid` keeps gradient ids unique per copy. */
export function ProfileShape({ finish = 'mill', uid, dims }: { finish?: Finish; uid: string; dims?: boolean }) {
  return (
    <svg className="profile-shape" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-mill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef1f4" /><stop offset=".32" stopColor="#a3adb9" /><stop offset=".56" stopColor="#e3e8ed" /><stop offset="1" stopColor="#8793a1" />
        </linearGradient>
        <linearGradient id={`${uid}-anodised`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a6472" /><stop offset=".45" stopColor="#262d38" /><stop offset=".6" stopColor="#4a5361" /><stop offset="1" stopColor="#1a2029" />
        </linearGradient>
        <linearGradient id={`${uid}-powder`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3f7df0" /><stop offset="1" stopColor="#1a4fc0" />
        </linearGradient>
        <pattern id={`${uid}-wood`} width="200" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <rect width="200" height="26" fill="#b98556" />
          <path d="M0 6c40-5 70 5 110 0s60-3 90 1M0 15c50 4 80-5 120-1s50 3 80-1M0 22c30-3 90 4 130 0s40-2 70 1" fill="none" stroke="#8f5f37" strokeWidth="1.6" />
        </pattern>
      </defs>
      {finishes.map((f) => (
        <path key={f.id} className={f.id === finish ? 'fin on' : 'fin'} d={profileOutline} fill={`url(#${uid}-${f.id})`} />
      ))}
      <circle className="bore" cx="100" cy="100" r="14" />
      {dims && (
        <g className="dims">
          <path d="M-20 0V200M-28 0h16M-28 200h16" fill="none" strokeWidth="1.2" />
          <text x="-26" y="104" textAnchor="middle" transform="rotate(-90 -26 100)">40 mm</text>
        </g>
      )}
    </svg>
  );
}

/** Outline of a T-slot section, used as a quiet pattern in the hero. */
export function ProfilePattern() {
  const tile = (
    <g fill="none" strokeWidth="1.6">
      <rect width="70" height="70" rx="5" />
      <path d="M28 0V7H20V17H50V7H42V0M28 70V63H20V53H50V63H42V70M0 28H7V20H17V50H7V42H0M70 28H63V20H53V50H63V42H70" />
      <circle cx="35" cy="35" r="6" />
    </g>
  );
  const at = (x: number, y: number, key: string) => <g key={key} transform={`translate(${x} ${y})`}>{tile}</g>;
  return (
    <svg className="pattern" viewBox="0 0 210 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g stroke="rgba(228,234,240,.3)">
        {at(22, 150, 'a')}{at(118, 232, 'b')}{at(22, 314, 'c')}{at(118, 396, 'd')}{at(22, 478, 'e')}
      </g>
      <g stroke="#F0802B">{at(118, 118, 'f')}</g>
    </svg>
  );
}

/** Dimensioned cross-section of a 40 × 40 mm T-slot profile. */
export function ProfileSection() {
  return (
    <svg className="profile" viewBox="-36 -16 272 266" role="img" aria-label="Dimensioned cross-section of a 40 by 40 millimetre T-slot aluminium profile">
      <rect className="profile-outline" width="200" height="200" rx="10" fill="none" stroke="#0C2740" strokeWidth="2" pathLength={1} />
      <g className="profile-body">
        <rect width="200" height="200" rx="10" fill="#0C2740" />
        <g fill="#E4EAF0">
          <rect x="88" y="-2" width="24" height="18" /><rect x="72" y="14" width="56" height="22" rx="3" />
          <rect x="88" y="184" width="24" height="18" /><rect x="72" y="164" width="56" height="22" rx="3" />
          <rect x="-2" y="88" width="18" height="24" /><rect x="14" y="72" width="22" height="56" rx="3" />
          <rect x="184" y="88" width="18" height="24" /><rect x="164" y="72" width="22" height="56" rx="3" />
          <circle cx="100" cy="100" r="14" />
        </g>
      </g>
      <g className="profile-dims">
        <g stroke="#A84F0C" strokeWidth="1.4" fill="none">
          <line x1="0" y1="222" x2="200" y2="222" /><line x1="0" y1="214" x2="0" y2="230" /><line x1="200" y1="214" x2="200" y2="230" />
          <line x1="-20" y1="0" x2="-20" y2="200" /><line x1="-28" y1="0" x2="-12" y2="0" /><line x1="-28" y1="200" x2="-12" y2="200" />
        </g>
        <g fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="#A84F0C">
          <text x="100" y="244" textAnchor="middle">40</text>
          <text x="-26" y="104" textAnchor="middle" transform="rotate(-90 -26 100)">40</text>
        </g>
      </g>
    </svg>
  );
}

/** Canares Aquaculture icon, as published on canaresaquaculture.com. */
export function AquaIcon() {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Canares Aquaculture icon">
      <defs>
        <linearGradient id="aqua-icon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#123B5D" /><stop offset="1" stopColor="#2685B8" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#aqua-icon)" />
      <g transform="translate(9 9) scale(0.23)" fill="none" stroke="#fff" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 55 50 A 45 45 0 0 0 55 150 M 52 75 A 25 25 0 0 1 52 125" />
        <path d="M 68 76 C 110 40, 160 65, 190 100 C 160 135, 110 160, 68 124 M 150 72 A 38 38 0 0 1 150 128" />
      </g>
    </svg>
  );
}
