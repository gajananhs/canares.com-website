import { useEffect, useState } from 'react';
import { businesses, group } from '../content';
import Img from './Img';
import { Button, ProfileShape, Split, vars } from './graphics';

const layers = [
  { name: 'hero-quickair', widths: [420, 675], w: 675, h: 900 },
  null, // Canares Aluminium has no confirmed photographs, so its layer is drawn.
  { name: 'hero-aquaculture', widths: [332], w: 332, h: 631 },
  { name: 'hero-foundation', widths: [412], w: 412, h: 549 },
];

const HOLD = 4200;

export default function Hero() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  // The aperture moves through the four businesses on its own; pointing at a name holds it there.
  useEffect(() => {
    if (held || !document.documentElement.classList.contains('motion')) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % businesses.length), HOLD);
    return () => window.clearTimeout(t);
  }, [active, held]);

  const b = businesses[active];
  const pick = (i: number) => { setActive(i); setHeld(true); };

  return (
    <section className="hero" id="top" aria-label="Canares Group" style={vars({ '--c': b.color })}>
      <div className="hero-glow" aria-hidden="true"><i /><i /></div>
      <svg className="ln" data-line="hero" aria-hidden="true" />

      <div className="hero-head">
        <p className="eyebrow hero-in" style={vars({ '--d': '.1s' })}><i />{group.label}</p>
        <h1 className="hero-title" aria-label="Engineering that lasts.">
          <span className="row"><Split text="Engineering" /></span>
          <span className="row"><Split text="that lasts" from={11} /><i className="dot" data-anchor="dot" aria-hidden="true" /></span>
        </h1>
      </div>

      <div className="hero-stage" aria-hidden="true">
        <i className="ghost" data-depth="-18" />
        <div className="aperture" data-anchor="aperture" data-depth="8">
          {layers.map((p, i) => (
            <div key={i} className={i === active ? 'layer on' : 'layer'} data-kind={businesses[i].id}>
              {p ? <Img {...p} alt="" sizes="(max-width: 860px) 90vw, 30vw" eager={i === 0} /> : (
                <span className="layer-draw"><ProfileShape uid="h1" /><ProfileShape uid="h2" /><ProfileShape uid="h3" /></span>
              )}
            </div>
          ))}
        </div>
        <p className="stage-tag" data-depth="24" key={active}><b>{b.n}</b><span>{b.name}</span><small>{b.pillar}</small></p>
      </div>

      <div className="hero-foot">
        <div className="hero-lead">
          <p className="hero-intro hero-in" style={vars({ '--d': '1.05s' })}>{group.intro.split('. ')[0]}.</p>
          <div className="cta hero-in" style={vars({ '--d': '1.2s' })}>
            <Button href="#businesses" down>Explore our businesses</Button>
            <a className="link" href="#story"><span>Discover Canares</span></a>
          </div>
        </div>
        <ol className="hero-index hero-in" style={vars({ '--d': '1.35s' })} onMouseLeave={() => setHeld(false)}>
          {businesses.map((x, i) => (
            <li key={x.id} style={vars({ '--c': x.color })}>
              <a href={`#${x.id}`} className={i === active ? 'on' : undefined} onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onBlur={() => setHeld(false)}>
                <small>{x.n}</small>
                <span>{x.title[x.title.length - 1]}</span>
                <i className="tick" aria-hidden="true">{i === active && <i key={`${active}-${held}`} className={held ? 'full' : undefined} />}</i>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
