import { useState, type ReactNode } from 'react';
import { businesses, type Business } from '../content';
import Img from './Img';
import { Button, ProfileShape, Split, finishes, vars, type Finish } from './graphics';

const by = (id: string) => businesses.find((b) => b.id === id)!;
const dark: Record<string, string> = { quickair: 'var(--qa-d)', aluminium: 'var(--al-d)', aquaculture: 'var(--aq)', foundation: 'var(--fn-d)' };

/** Number, title, one description, an optional line of facts and the link out. Shared by all four chapters. */
function Copy({ b, children }: { b: Business; children?: ReactNode }) {
  let from = 0;
  return (
    <div className="biz-copy">
      <p className="eyebrow" data-reveal><i />{b.n} · {b.pillar}</p>
      <h2 className="biz-title" id={`${b.id}-h`} aria-label={b.name} data-title>
        <a href={b.url} target="_blank" rel="noopener" aria-label={`${b.name}, visit ${b.domain}`}>
          {b.title.map((t) => {
            const row = <span key={t} className="row"><Split text={t} from={from} /></span>;
            from += t.length;
            return row;
          })}
        </a>
      </h2>
      <p className="biz-line" data-reveal>{b.line}</p>
      {children}
      <div className="biz-go" data-reveal>
        <Button href={b.url} external small={b.domain}>Visit {b.title[b.title.length - 1]}</Button>
        <span className="biz-where">{b.where}</span>
      </div>
    </div>
  );
}

function Chapter({ b, cls, children }: { b: Business; cls: string; children: ReactNode }) {
  return (
    <section className={`biz ${cls}`} id={b.id} style={vars({ '--c': b.color, '--cd': dark[b.id] })} aria-labelledby={`${b.id}-h`}>
      <span className="biz-no" aria-hidden="true"><span data-parallax="-14">{b.n}</span></span>
      {children}
    </section>
  );
}

function Quickair() {
  const b = by('quickair');
  return (
    <Chapter b={b} cls="qa">
      <svg className="ln" data-line="qa" aria-hidden="true" />
      <div className="inner biz-grid">
        <Copy b={b}>
          <ul className="biz-specs" data-reveal>
            <li><b>20–63 mm</b>Push-fit range</li>
            <li><b>40 bar</b>Crimped systems</li>
            <li><b>ISO 9001:2015</b>Certified</li>
          </ul>
        </Copy>
        <div className="biz-visual">
          <a className="frame qa-frame" href={b.url} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true" data-anchor="frame" data-tilt data-cursor="Visit">
            <span className="frame-in" data-wipe="left">
              <Img name="cap-design" widths={[520, 900, 1200]} w={1200} h={900} sizes="(max-width: 860px) 100vw, 50vw" alt="" />
            </span>
            <span className="frame-note">Quickair ring main with regulator and gauge</span>
          </a>
        </div>
      </div>
    </Chapter>
  );
}

function Aluminium() {
  const b = by('aluminium');
  const [finish, setFinish] = useState<Finish>('mill');
  const row = '6063 · 6061 · Mill · Anodised · Powder-coated · Wood finish · ';
  return (
    <Chapter b={b} cls="al">
      <svg className="ln" data-line="al" aria-hidden="true" />
      <div className="inner biz-grid flip">
        <Copy b={b}>
          <div className="al-finishes" role="group" aria-label="Surface finish" data-reveal>
            {finishes.map((f) => (
              <button key={f.id} type="button" className={f.id === finish ? `fin-${f.id} on` : `fin-${f.id}`} aria-pressed={f.id === finish} onClick={() => setFinish(f.id)}>
                <i />{f.label}
              </button>
            ))}
          </div>
        </Copy>
        <div className="biz-visual">
          <div className="al-profile" data-anchor="profile" data-sheen>
            <ProfileShape finish={finish} uid="al" dims />
          </div>
        </div>
      </div>
      <p className="al-marquee" aria-hidden="true"><span data-marquee>{row}{row}{row}</span></p>
    </Chapter>
  );
}

function Aquaculture() {
  const b = by('aquaculture');
  return (
    <Chapter b={b} cls="aq">
      <div className="aq-water" aria-hidden="true"><i /><i /></div>
      <svg className="ln" data-line="aq" aria-hidden="true" />
      <div className="inner biz-grid">
        <Copy b={b} />
        <div className="biz-visual">
          <div className="aq-rings" data-anchor="rings">
            <canvas data-fish aria-hidden="true" />
            <i className="ring r9" aria-hidden="true"><small>9 m</small></i>
            <i className="ring r6" aria-hidden="true"><small>6 m</small></i>
            <small className="r12" aria-hidden="true">12 m</small>
            <a className="aq-photo" href={b.url} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true" data-cursor="Visit">
              <Img name="aquaculture-tank" widths={[331]} w={331} h={331} alt="" />
            </a>
          </div>
          <p className="aq-note" data-reveal>HDPE sea cages of 6, 9 and 12 m diameter</p>
        </div>
      </div>
    </Chapter>
  );
}

const photos = [
  { cls: 'p1', name: 'foundation-school', note: 'Government school event', sizes: '(max-width: 860px) 70vw, 30vw' },
  { cls: 'p2', name: 'foundation-camp', note: 'Health camp', sizes: '(max-width: 860px) 46vw, 20vw' },
  { cls: 'p3', name: 'foundation-lamp', note: 'Lamp-lighting', sizes: '(max-width: 860px) 36vw, 15vw' },
];

function Foundation() {
  const b = by('foundation');
  return (
    <Chapter b={b} cls="fn">
      <div className="inner biz-grid flip">
        <Copy b={b} />
        <div className="biz-visual">
          <div className="fn-collage">
            {photos.map((p, i) => (
              <div key={p.name} className={`ph ${p.cls}`} {...(i === 0 ? { 'data-anchor': 'photo' } : { 'data-parallax': i === 1 ? '-10' : '14' })}>
                <a className="frame" href={b.url} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true" data-cursor="Visit">
                  <span className="frame-in" data-wipe="up">
                    <Img name={p.name} widths={[360, 550]} w={550} h={550} sizes={p.sizes} alt="" />
                  </span>
                  <span className="frame-note">{p.note}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <svg className="ln over" data-line="fn" aria-hidden="true" />
    </Chapter>
  );
}

export default function Businesses() {
  return (
    <div id="businesses" className="businesses">
      <Quickair />
      <Aluminium />
      <Aquaculture />
      <Foundation />
    </div>
  );
}
