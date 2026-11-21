import { businesses, group } from '../content';
import Img from './Img';
import { ProfilePattern, vars } from './graphics';

// Height of the line inside each panel, and the vertical joint that links it to the previous panel.
const line = [
  { y: '22%', d: '.25s' },
  { y: '15%', d: '.8s', jt: '15%', jh: '7%' },
  { y: '25%', d: '1.35s', jt: '15%', jh: '10%' },
  { y: '18%', d: '1.9s', jt: '18%', jh: '7%' },
];

const photos = [
  { name: 'hero-quickair', widths: [420, 675], w: 675, h: 900 },
  null,
  { name: 'hero-aquaculture', widths: [332], w: 332, h: 631 },
  { name: 'hero-foundation', widths: [412], w: 412, h: 549 },
];

export default function Hero() {
  return (
    <section className="hero" id="top" data-tone="dark" aria-label="Canares Group">
      <div className="slats">
        {businesses.map((b, i) => {
          const p = photos[i];
          const l = line[i];
          return (
            <a key={b.id} className="slat" href={`#${b.id}`} data-slat
              style={vars({ '--c': b.color, '--y': l.y, '--d': l.d, '--jt': l.jt ?? '0%', '--jh': l.jh ?? '0%' })}>
              <span className="slat-media" data-slat-media>
                {p ? <Img {...p} alt="" sizes="(max-width: 860px) 25vw, 25vw" eager={i === 0} /> : <ProfilePattern />}
              </span>
              <i className="tint" />
              {l.jt && <i className="join" />}
              <i className="seg" />
              <span className="foot">
                <small>{b.n}<span> · {b.pillar}</span></small>
                <b>{b.name}</b>
              </span>
            </a>
          );
        })}
      </div>
      <i className="hero-rail" aria-hidden="true" />
      <div className="hero-body">
        <p className="pill hero-in" style={vars({ '--i': '0' })}>{group.label}</p>
        <h1 className="hero-title">
          <span className="ln"><span className="hero-in" style={vars({ '--i': '1' })}>{group.headline[0]}</span></span>
          <span className="ln"><span className="hero-in" style={vars({ '--i': '2' })}>{group.headline[1]} <em>{group.headline[2]}</em></span></span>
        </h1>
        <p className="hero-intro hero-in" style={vars({ '--i': '3' })}>{group.intro}</p>
        <div className="cta hero-in" style={vars({ '--i': '4' })}>
          <a className="btn solid" href="#businesses" data-magnetic>Explore our businesses <span aria-hidden="true">↓</span></a>
          <a className="btn ghost" href="#group">Our story</a>
        </div>
      </div>
    </section>
  );
}
