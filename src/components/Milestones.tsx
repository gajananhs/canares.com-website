import { milestones } from '../content';
import { Split } from './graphics';

/** The group's story: the year stays in view while the milestones scroll past it. */
export default function Milestones() {
  return (
    <section className="story" id="story" aria-labelledby="story-h">
      <div className="inner">
        <p className="eyebrow" data-reveal><i />Our story</p>
        <h2 className="sec-title" id="story-h" aria-label="Built step by step since 1998." data-title>
          <span className="row"><Split text="Built step by step" /></span>
          <span className="row"><Split text="since 1998." from={15} /></span>
        </h2>
        <div className="story-grid">
          <div className="story-sticky" aria-hidden="true">
            <div className="year"><div className="reel" data-reel>{milestones.map((m) => <span key={m.year}>{m.year}</span>)}</div></div>
            <p className="story-count"><b data-step>01</b> / {String(milestones.length).padStart(2, '0')}<i><i data-step-bar /></i></p>
          </div>
          <ol className="story-list">
            {milestones.map((m) => (
              <li key={m.year} data-step-item>
                <span className="y">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
