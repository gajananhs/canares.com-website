import { identity } from '../content';

export default function Identity() {
  return (
    <section className="identity tone-light" id="group" data-tone="light" style={{ ['--from' as string]: 'var(--fn)' }} aria-labelledby="group-h">
      <i className="rail" data-rail aria-hidden="true" />
      <div className="inner">
        <p className="eyebrow" data-reveal>What Canares stands for</p>
        <h2 className="philosophy" id="group-h">
          {identity.philosophy.map((line) => <span key={line} data-reveal>{line}</span>)}
        </h2>
        <div className="identity-grid">
          <div className="vision" data-reveal>
            <h3>Our vision</h3>
            <p>{identity.vision}</p>
          </div>
          <ol className="approach" aria-label="Our approach to business">
            {identity.approach.map((a, i) => (
              <li key={a.title} data-reveal>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <h3 className="values-h" data-reveal>Five values, and what each one means in practice</h3>
        <dl className="values">
          {identity.values.map((v) => (
            <div key={v.name} data-reveal>
              <dt>{v.name}</dt>
              <dd>{v.practice}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
