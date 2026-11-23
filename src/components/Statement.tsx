import { group, introLine } from '../content';

export default function Statement() {
  const words = introLine.split(' ');
  return (
    <section className="intro" id="intro" aria-labelledby="intro-h">
      <svg className="ln" data-line="intro" aria-hidden="true" />
      <div className="inner">
        <p className="eyebrow" id="intro-h" data-reveal><i />The group</p>
        <p className="intro-text" data-words>
          {words.map((w, i) => (
            <span key={i} className="word">{w}{i < words.length - 1 ? ' ' : ''}</span>
          ))}
        </p>
        <dl className="facts">
          {group.facts.map((f) => (
            <div key={f.label} data-reveal>
              <dd>{f.value}</dd>
              <dt>{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
