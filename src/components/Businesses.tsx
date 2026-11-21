import { businesses, type Business } from '../content';
import Img from './Img';
import { Arrow, AquaIcon, ProfileSection, vars } from './graphics';

const by = (id: string) => businesses.find((b) => b.id === id)!;

function Explore({ b }: { b: Business }) {
  return (
    <a className="go" href={b.url} target="_blank" rel="noopener" data-magnetic>
      <span>Explore {b.name} <Arrow /></span>
      <small>{b.domain}</small>
    </a>
  );
}

function Quickair() {
  const b = by('quickair');
  return (
    <section className="chapter q" id="quickair" data-tone="dark" data-chapter="01" style={vars({ '--c': b.color })} aria-labelledby="quickair-h">
      <div className="q-photo" data-wipe>
        <Img name="quickair-install" widths={[640, 1100]} w={1100} h={495} sizes="(max-width: 860px) 100vw, 70vw"
          alt="Blue Quickair aluminium piping with filters and valves at a pump station" />
      </div>
      <i className="q-shade" aria-hidden="true" />
      <i className="rail" data-rail aria-hidden="true" />
      <div className="q-main" aria-hidden="true">
        <i className="q-fit" /><i className="q-run" data-run />
        <i className="q-drop" data-drop style={vars({ left: '58%' })} /><i className="q-drop d2" data-drop style={vars({ left: '84%' })} />
        <span className="q-tag">Ring main · drop legs</span>
      </div>
      <div className="inner">
        <p className="k" data-reveal>{b.n} · {b.pillar}</p>
        <p className="logo" data-reveal><span className="plate"><Img name="logo-quickair" widths={[408]} w={408} h={179} alt="Quickair logo" /></span></p>
        <h2 id="quickair-h" data-reveal>Quickair</h2>
        <p className="who" data-reveal>Canares Automation Pvt. Ltd. · Bengaluru · Since 1998</p>
        <p className="lead" data-reveal>
          Modular piping for compressed air, vacuum and inert gases. Aluminium, stainless steel and PEX pipe joins with
          push-fit or crimped fittings, so a line goes in with basic tools and no welding.
        </p>
        <ul className="caps" data-reveal>
          <li>Push-fit and crimped piping systems</li>
          <li>Valves, actuators and valve automation</li>
          <li>Site survey, design, installation and pressure testing</li>
        </ul>
        <dl className="specs" data-reveal>
          <div><dd>20–63 mm</dd><dt>Push-fit range</dt></div>
          <div><dd>40 bar</dd><dt>Crimped systems</dt></div>
          <div><dd>ISO 9001:2015</dd><dt>Certified</dt></div>
        </dl>
        <div data-reveal><Explore b={b} /></div>
      </div>
    </section>
  );
}

function Aluminium() {
  const b = by('aluminium');
  return (
    <section className="chapter a tone-light" id="aluminium" data-tone="light" data-chapter="02" style={vars({ '--c': b.color, '--from': 'var(--qa)' })} aria-labelledby="aluminium-h">
      <i className="rail" data-rail aria-hidden="true" />
      <svg className="a-notch" viewBox="0 0 34 112" aria-hidden="true">
        <polyline points="1.5,2 30,2 30,36 16,36 16,76 30,76 30,110 1.5,110" fill="#E4EAF0" stroke="#F0802B" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <div className="inner split">
        <div className="col">
          <p className="k" data-reveal>{b.n} · {b.pillar}</p>
          <p className="logo" data-reveal><Img name="logo-canares-c" widths={[144]} w={144} h={144} alt="Canares logo" /><span>Canares Aluminium</span></p>
          <h2 id="aluminium-h" data-reveal>Canares Aluminium</h2>
          <p className="who" data-reveal>Extrusion plant · Kumta, Uttara Kannada</p>
          <p className="lead" data-reveal>
            Aluminium extrusion profiles, tubes, bars and rods. Standard sections serve industry, architecture, solar and
            signage, and custom dies are cut when a standard section will not do.
          </p>
          <ul className="caps" data-reveal>
            <li>6063 and 6061 alloys</li>
            <li>52 published standard sections</li>
            <li>Custom die development</li>
          </ul>
          <div data-reveal><Explore b={b} /></div>
        </div>
        <div className="a-draw" data-profile>
          <ProfileSection />
          <ul className="finishes" aria-label="Available finishes">
            <li data-finish><i className="f-mill" />Mill</li>
            <li data-finish><i className="f-anodised" />Anodised</li>
            <li data-finish><i className="f-powder" />Powder-coated</li>
            <li data-finish><i className="f-wood" />Wood finish</li>
          </ul>
          <p className="ticker" data-finish>20×20 V-slot · 40×40 · 45×45 · 80×80 · 80×160</p>
        </div>
      </div>
    </section>
  );
}

const stages = ['Broodstock', 'Breeding', 'Hatching', 'Larval rearing', 'Fry', 'Fingerlings', 'Sea cages', 'Harvest', 'Market supply'];

function Aquaculture() {
  const b = by('aquaculture');
  return (
    <section className="chapter w" id="aquaculture" data-tone="dark" data-chapter="03" style={vars({ '--c': b.color, '--from': 'var(--al)' })} aria-labelledby="aquaculture-h">
      <i className="rail" data-rail aria-hidden="true" />
      <i className="w-branch" data-run aria-hidden="true" />
      <div className="inner split">
        <div className="cage">
          <div className="cage-photo" data-circle>
            <Img name="aquaculture-tank" widths={[331]} w={331} h={331} alt="Asian Sea Bass juveniles in a hatchery tank at Holanagadde" />
          </div>
          {stages.map((s, i) => <b key={s} data-marker style={vars({ '--i': String(i) })} aria-hidden="true">{String(i + 1).padStart(2, '0')}</b>)}
        </div>
        <div className="col">
          <p className="k" data-reveal>{b.n} · {b.pillar}</p>
          <p className="logo" data-reveal><AquaIcon /><span>Canares Aquaculture LLP</span></p>
          <h2 id="aquaculture-h" data-reveal>Canares Aquaculture</h2>
          <p className="who" data-reveal>Hatchery and sea cages · Holanagadde, Kumta</p>
          <p className="lead" data-reveal>
            A marine hatchery and sea cage farm for Asian Sea Bass (Barramundi). Graded, pellet-weaned fingerlings are
            raised in a recirculating hatchery and grown to market size in floating cages at sea.
          </p>
          <ul className="caps" data-reveal>
            <li>Broodstock, fry and fingerlings of 1.5 to 3.5 inches</li>
            <li>Sea-cage-grown fish of 1.0 to 1.5 kg</li>
            <li>HDPE cages of 6, 9 and 12 m diameter</li>
          </ul>
          <ol className="stages" data-reveal aria-label="Nine stages from broodstock to market">
            {stages.map((s, i) => <li key={s}><b>{String(i + 1).padStart(2, '0')}</b>{s}</li>)}
          </ol>
          <div data-reveal><Explore b={b} /></div>
        </div>
      </div>
    </section>
  );
}

const projects = [
  ['School uniforms', 'Holanagadde Govt. School'],
  ['Smart TV for digital learning', 'Gudekoppa Govt. School'],
  ['Furniture and campus repainting', 'Hini Govt. School'],
  ['Health check-up and blood donation camp', 'Uttara Kannada'],
];

function Foundation() {
  const b = by('foundation');
  return (
    <section className="chapter f tone-light" id="foundation" data-tone="light" data-chapter="04" style={vars({ '--c': b.color, '--from': 'var(--aq)' })} aria-labelledby="foundation-h">
      <i className="rail" data-rail aria-hidden="true" />
      <svg className="f-loop" viewBox="0 0 52 110" aria-hidden="true">
        <rect x="0" y="0" width="3" height="110" fill="#FBFCFD" />
        <path d="M1.5 0 V28 C1.5 78 50 84 50 52 C50 26 18 28 18 56 C18 86 1.5 80 1.5 110" fill="none" stroke="#7BC257" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="inner split">
        <div className="col">
          <p className="k" data-reveal>{b.n} · {b.pillar}</p>
          <p className="logo" data-reveal><Img className="logo-fn" name="logo-foundation" widths={[320]} w={231} h={198} alt="Canares Foundation logo" /></p>
          <h2 id="foundation-h" data-reveal>Canares Foundation</h2>
          <p className="who" data-reveal>Not-for-profit · Holanagadde, Karnataka</p>
          <p className="lead" data-reveal>
            The group’s community arm. It organises free health camps for elderly residents, equips government schools
            and supports girls’ education in rural Uttara Kannada.
          </p>
          <ul className="projects" data-reveal>
            {projects.map(([what, where]) => <li key={what}><span>{what}</span><small>{where}</small></li>)}
          </ul>
          <div data-reveal><Explore b={b} /></div>
        </div>
        <div className="collage">
          <Img className="c1" name="foundation-school" widths={[360, 550]} w={550} h={550} sizes="(max-width: 860px) 58vw, 30vw"
            alt="Schoolchildren seated in a hall at a Canares Foundation event" />
          <Img className="c2" name="foundation-camp" widths={[360, 550]} w={550} h={550} sizes="(max-width: 860px) 44vw, 22vw"
            alt="Volunteers handing out medicines at a Canares Foundation health camp" />
          <Img className="c3" name="foundation-lamp" widths={[360, 550]} w={550} h={550} sizes="(max-width: 860px) 32vw, 16vw"
            alt="Lamp-lighting at the opening of a Canares Foundation event" />
        </div>
      </div>
    </section>
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
