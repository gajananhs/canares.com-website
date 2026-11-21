import { useEffect, useRef } from 'react';
import { businesses, group, nav } from '../content';
import { Arrow } from './graphics';

interface Props { open: boolean; setOpen: (v: boolean) => void }

const sections = [
  { id: 'top', label: 'Top' },
  { id: 'statement', label: 'The group' },
  { id: 'quickair', label: 'Quickair' },
  { id: 'aluminium', label: 'Canares Aluminium' },
  { id: 'aquaculture', label: 'Canares Aquaculture' },
  { id: 'foundation', label: 'Canares Foundation' },
  { id: 'group', label: 'What Canares stands for' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'contact', label: 'Enquiries' },
];

export default function Header({ open, setOpen }: Props) {
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const first = menu.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (e.key !== 'Tab' || !menu.current) return;
      const items = menu.current.querySelectorAll<HTMLElement>('a, button');
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
      <a className="skip" href="#statement">Skip to content</a>
      <header className="header" data-header data-tone="dark">
        <div className="bar">
          <a className="mark" href="#top" aria-label="Canares, home">CANARES<em>.</em></a>
          <nav className="bar-nav" aria-label="Main">
            {nav.slice(0, 4).map((n) => <a key={n.id} href={`#${n.id}`}>{n.label}</a>)}
          </nav>
          <button ref={toggle} className="menu-btn" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
            <span className="menu-ico" aria-hidden="true"><i /><i /></span>
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>

      <div className="menu" id="menu" ref={menu} role="dialog" aria-modal="true" aria-label="Site index" {...(open ? {} : { inert: '' as unknown as boolean })}>
        <div className="menu-in">
          <ol className="menu-links">
            {nav.map((n, i) => (
              <li key={n.id}><a href={`#${n.id}`} onClick={close}><small>{String(i + 1).padStart(2, '0')}</small>{n.label}</a></li>
            ))}
          </ol>
          <div className="menu-biz">
            <p>Our businesses</p>
            <ul>
              {businesses.map((b) => (
                <li key={b.id} style={{ ['--c' as string]: b.color }}>
                  <a href={`#${b.id}`} onClick={close}><i />{b.name}<small>{b.pillar}</small></a>
                  <a className="ext" href={b.url} target="_blank" rel="noopener" aria-label={`Visit ${b.domain}`}><Arrow /></a>
                </li>
              ))}
            </ul>
          </div>
          <div className="menu-foot">
            <span>Bengaluru · Kumta</span>
            <a href={`mailto:${group.email}`}>{group.email}</a>
            <button className="menu-close" type="button" onClick={() => { close(); toggle.current?.focus(); }}>Close</button>
          </div>
        </div>
      </div>

      <nav className="progress" data-progress aria-label="Sections">
        {sections.map((s) => <a key={s.id} href={`#${s.id}`} data-for={s.id} aria-label={s.label}><span>{s.label}</span></a>)}
      </nav>
    </>
  );
}
