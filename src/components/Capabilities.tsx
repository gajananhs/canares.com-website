import { useState } from 'react';
import { businesses, capabilities } from '../content';
import Img from './Img';
import { ProfileSection } from './graphics';

export default function Capabilities() {
  const [open, setOpen] = useState(0);
  return (
    <section className="capabilities" id="capabilities" data-tone="dark" aria-labelledby="cap-h">
      <i className="rail" data-rail aria-hidden="true" />
      <div className="inner">
        <p className="eyebrow" data-reveal>Group capabilities</p>
        <h2 id="cap-h" data-reveal>What the group can do, across four businesses</h2>
        <ul className="cap-list">
          {capabilities.map((c, i) => {
            const isOpen = open === i;
            return (
              <li key={c.title} className={isOpen ? 'cap open' : 'cap'} data-reveal>
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={`cap-${i}`} id={`cap-btn-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="cap-title">{c.title}</span>
                    <span className="cap-dots" aria-hidden="true">
                      {businesses.map((b) => <i key={b.id} style={{ background: c.used.includes(b.id) ? b.color : undefined }} className={c.used.includes(b.id) ? 'on' : ''} />)}
                    </span>
                    <span className="cap-sign" aria-hidden="true" />
                  </button>
                </h3>
                <div className="cap-panel" id={`cap-${i}`} role="region" aria-labelledby={`cap-btn-${i}`} {...(isOpen ? {} : { inert: '' as unknown as boolean })}>
                  <div className="cap-panel-in">
                    <div className="cap-copy">
                      <p>{c.text}</p>
                      <p className="cap-used">
                        <span>Used by</span>
                        {businesses.filter((b) => c.used.includes(b.id)).map((b) => (
                          <a key={b.id} href={`#${b.id}`}><i style={{ background: b.color }} />{b.name}</a>
                        ))}
                      </p>
                    </div>
                    <div className="cap-media">
                      {c.image
                        ? <Img {...c.image} sizes="(max-width: 860px) 90vw, 34vw" />
                        : <div className="cap-drawing"><ProfileSection /></div>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
