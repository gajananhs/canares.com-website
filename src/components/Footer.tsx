import { businesses, group, social } from '../content';
import { ArrowIcon, Split, vars } from './graphics';

/** Closing section: how to reach the group, the four business sites and the legal line. */
export default function Footer() {
  return (
    <footer className="footer" id="contact" aria-labelledby="contact-h">
      <div className="inner">
        <p className="eyebrow" data-reveal><i />Contact</p>
        <h2 className="sec-title" id="contact-h" aria-label="Start a conversation." data-title>
          <span className="row"><Split text="Start a" /></span>
          <span className="row"><Split text="conversation." from={6} /></span>
        </h2>
        <a className="foot-mail" href={`mailto:${group.email}`} data-reveal data-magnetic>
          <span>{group.email}</span><span className="btn-ico" aria-hidden="true"><ArrowIcon /><ArrowIcon /></span>
        </a>

        <div className="foot-grid">
          <div data-reveal>
            <h3>Group office</h3>
            <p>{group.company}<br />{group.address[0]}<br />{group.address[1]}</p>
            <p><a className="link" href={`tel:${group.phone.replace(/\s/g, '')}`}><span>{group.phone}</span></a></p>
          </div>
          <div data-reveal>
            <h3>Coastal operations</h3>
            <p>{group.coast}</p>
          </div>
          <nav aria-label="Business websites" data-reveal>
            <h3>Visit a business</h3>
            <ul>
              {businesses.map((b) => (
                <li key={b.id} style={vars({ '--c': b.color })}>
                  <a className="link" href={b.url} target="_blank" rel="noopener"><i /><span>{b.name}</span><ArrowIcon /></a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Social media" data-reveal>
            <h3>Follow</h3>
            <ul>{social.map((s) => <li key={s.name}><a className="link" href={s.url} target="_blank" rel="noopener"><span>{s.name}</span><ArrowIcon /></a></li>)}</ul>
          </nav>
        </div>

        <p className="foot-word" aria-hidden="true" data-word><Split text="CANARES" /></p>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} Canares. All rights reserved.</p>
          <a className="link" href="#top"><span>Back to top</span></a>
        </div>
      </div>
    </footer>
  );
}
