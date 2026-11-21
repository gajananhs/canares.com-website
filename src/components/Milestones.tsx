import { milestones, proof } from '../content';
import Img from './Img';
import { Arrow } from './graphics';

export default function Milestones() {
  return (
    <section className="milestones tone-light" id="milestones" data-tone="light" aria-labelledby="ms-h">
      <i className="rail" data-rail aria-hidden="true" />
      <div className="inner">
        <p className="eyebrow" data-reveal>Milestones and proof</p>
        <h2 id="ms-h" data-reveal>Built step by step since 1998</h2>
        <div className="ms-grid">
          <ol className="timeline">
            {milestones.map((m) => (
              <li key={m.year} data-reveal>
                <i className="node" aria-hidden="true" />
                <span className="year">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </li>
            ))}
          </ol>
          <div className="proof">
            <h3 className="proof-h" data-reveal>Operating facts, as published by each business</h3>
            <dl className="proof-grid">
              {proof.map((p) => (
                <div key={p.label} data-reveal>
                  <dd>
                    {p.count ? <span data-count={p.count}>{p.value}</span> : p.value}
                    <small>{p.unit}</small>
                  </dd>
                  <dt>{p.label}</dt>
                </div>
              ))}
            </dl>
            <a className="cert" data-reveal href="https://canares.com/certifications-and-quality-compliance/" target="_blank" rel="noopener">
              <Img name="iso-certificate" widths={[480]} w={480} h={678} alt="ISO 9001:2015 certificate of registration for Canares Automation Private Limited" />
              <span>
                <b>ISO 9001:2015</b>
                Certificate ICI/4792572/24, issued to Canares Automation Private Limited for the design and manufacture
                of modular piping and fittings, valves and actuators, aluminium extrusion and related systems.
                <em>View the certificate <Arrow /></em>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
