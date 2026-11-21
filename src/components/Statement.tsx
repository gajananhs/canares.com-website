import { group } from '../content';

export default function Statement() {
  const words = group.statement.split(' ');
  return (
    <section className="statement tone-light" id="statement" data-tone="light" aria-labelledby="statement-h">
      <i className="rail" data-rail aria-hidden="true" />
      <div className="inner">
        <p className="eyebrow" id="statement-h">The group</p>
        <p className="statement-text" data-words>
          {words.map((w, i) => (
            <span key={i} className="word">{w}{i < words.length - 1 ? ' ' : ''}</span>
          ))}
        </p>
        <dl className="facts">
          {group.facts.map((f) => (
            <div key={f.label} data-reveal>
              <dt>{f.label}</dt>
              <dd>{'count' in f && f.count ? <span data-count={f.count}>{f.value}</span> : f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
