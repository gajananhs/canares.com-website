import { businesses, group, nav, social } from '../content';
import { Arrow } from './graphics';

export default function Footer() {
  return (
    <footer className="footer" data-tone="dark">
      <div className="inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="mark" href="#top" aria-label="Canares, back to top">CANARES<em>.</em></a>
            <p>
              A group of manufacturing and aquaculture businesses from Karnataka, India, working in industrial systems,
              materials, food and community development since 1998.
            </p>
          </div>
          <nav aria-label="Our businesses">
            <h3>Our businesses</h3>
            <ul>
              {businesses.map((b) => (
                <li key={b.id}><a href={b.url} target="_blank" rel="noopener"><i style={{ background: b.color }} />{b.name} <Arrow /></a></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer">
            <h3>On this page</h3>
            <ul>{nav.map((n) => <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>)}</ul>
          </nav>
          <div>
            <h3>Contact</h3>
            <ul>
              <li><a href={`tel:${group.phone.replace(/\s/g, '')}`}>{group.phone}</a></li>
              <li><a href={`mailto:${group.email}`}>{group.email}</a></li>
              <li className="addr">{group.company}<br />{group.address[0]}<br />{group.address[1]}</li>
            </ul>
          </div>
        </div>
        <p className="footer-word" aria-hidden="true">CANARES</p>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Canares. All rights reserved.</p>
          <ul>{social.map((s) => <li key={s.name}><a href={s.url} target="_blank" rel="noopener">{s.name} <Arrow /></a></li>)}</ul>
        </div>
      </div>
    </footer>
  );
}
