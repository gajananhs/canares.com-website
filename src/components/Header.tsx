import { useEffect, useRef, useState } from 'react';
import { businesses, group, nav } from '../content';
import Img from './Img';
import { ArrowIcon, ProfileShape, vars } from './graphics';

interface Props { open: boolean; setOpen: (v: boolean) => void }

const dots = [
  { id: 'top', label: 'Canares' },
  ...businesses.map((b) => ({ id: b.id as string, label: b.name })),
  { id: 'story', label: 'Story' },
  { id: 'contact', label: 'Contact' },
];

const previews = [
  { name: 'cap-design', widths: [520, 900], w: 900, h: 675 },
  null,
  { name: 'hero-aquaculture', widths: [332], w: 332, h: 631 },
  { name: 'foundation-school', widths: [360, 550], w: 550, h: 550 },
];

export default function Header({ open, setOpen }: Props) {
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (e.key !== 'Tab' || !menu.current || !toggle.current) return;
      const items = [toggle.current, ...Array.from(menu.current.querySelectorAll<HTMLElement>('a, button'))];
      const a = items[0], z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  const close = () => setOpen(false);

  return (
    <>
      <a className="skip" href="#intro">Skip to content</a>
      <header className="header" data-header>
        <div className="bar">
          <a className="mark" href="#top" aria-label="Canares, home" onClick={close}>CANARES<em>.</em></a>
          <nav className="bar-nav" aria-label="Main">
            {nav.map((n) => <a key={n.id} href={`#${n.id}`} data-nav={n.id}>{n.label}</a>)}
          </nav>
          <button ref={toggle} className="menu-btn" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
            <span className="menu-word"><span>Menu</span><span>Close</span></span>
            <span className="menu-ico" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </header>

      <div className="menu" id="menu" ref={menu} role="dialog" aria-modal="true" aria-label="Site menu" {...(open ? {} : { inert: '' as unknown as boolean })}>
        <i className="menu-bg" aria-hidden="true" />
        <div className="menu-in">
          <div className="menu-main">
            <p className="eyebrow">Our businesses</p>
            <ol className="menu-biz">
              {businesses.map((b, i) => (
                <li key={b.id} style={vars({ '--c': b.color, '--i': String(i) })}>
                  <a href={`#${b.id}`} onClick={close} onMouseEnter={() => setPreview(i)} onFocus={() => setPreview(i)}>
                    <small>{b.n}</small><span>{b.name}</span><em>{b.pillar}</em>
                  </a>
                </li>
              ))}
            </ol>
            <ul className="menu-links">
              {nav.slice(1).map((n, i) => (
                <li key={n.id} style={vars({ '--i': String(i + 4) })}><a href={`#${n.id}`} onClick={close}>{n.label}</a></li>
              ))}
              <li style={vars({ '--i': '6' })}><a href={`mailto:${group.email}`}>{group.email} <ArrowIcon /></a></li>
            </ul>
          </div>
          <div className="menu-preview" aria-hidden="true">
            {previews.map((p, i) => (
              <div key={i} className={i === preview ? 'pv on' : 'pv'} style={vars({ '--c': businesses[i].color })}>
                {p ? <Img {...p} alt="" /> : <span className="pv-draw"><ProfileShape uid={`pv${i}`} /></span>}
              </div>
            ))}
            <p><b>{businesses[preview].n}</b>{businesses[preview].name}</p>
          </div>
        </div>
      </div>

      <nav className="dots" data-dots aria-label="Sections">
        {dots.map((s) => <a key={s.id} href={`#${s.id}`} data-for={s.id} aria-label={s.label}><span>{s.label}</span></a>)}
      </nav>
    </>
  );
}
