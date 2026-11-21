import { useState, type FormEvent } from 'react';
import { businesses, enquiryTypes, group, type BusinessId } from '../content';
import { Arrow } from './graphics';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'mail';

// When this is set at build time the form posts to it. Without it, the form opens
// the visitor's email app with the message filled in. See README.md.
const endpoint = import.meta.env.VITE_ENQUIRY_ENDPOINT;

export default function Enquiry() {
  const [type, setType] = useState<(typeof enquiryTypes)[number]['id']>('general');
  const [biz, setBiz] = useState<BusinessId>('quickair');
  const [status, setStatus] = useState<Status>('idle');

  const business = businesses.find((b) => b.id === biz)!;
  const to = type === 'business' ? business.email : group.email;
  const typeLabel = enquiryTypes.find((t) => t.id === type)!.label;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = type === 'business' ? `Enquiry for ${business.name}` : `${typeLabel} for Canares Group`;
    data.set('subject', subject);
    data.set('recipient', to);

    if (endpoint) {
      setStatus('sending');
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        setStatus(res.ok ? 'sent' : 'error');
        if (res.ok) e.currentTarget?.reset?.();
      } catch {
        setStatus('error');
      }
      return;
    }

    const lines = [
      String(data.get('message') ?? ''),
      '',
      `Name: ${data.get('name') ?? ''}`,
      `Organisation: ${data.get('organisation') ?? ''}`,
      `Country: ${data.get('country') ?? ''}`,
      `Email: ${data.get('email') ?? ''}`,
      `Phone: ${data.get('phone') ?? ''}`,
    ];
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setStatus('mail');
  }

  return (
    <section className="enquiry" id="contact" data-tone="dark" aria-labelledby="contact-h">
      <i className="rail" data-rail aria-hidden="true" />
      <i className="rail-end" aria-hidden="true" />
      <div className="inner enquiry-grid">
        <div className="enquiry-intro">
          <p className="eyebrow" data-reveal>Enquiries</p>
          <h2 id="contact-h" data-reveal>Start a conversation with the group</h2>
          <p className="lead" data-reveal>
            Tell us what you need and we will direct it to the right team. Product and order questions are answered
            fastest by the business itself.
          </p>
          <address data-reveal>
            <div>
              <span>Group office</span>
              <b>{group.company}</b>
              {group.address.map((l) => <span key={l} className="line">{l}</span>)}
            </div>
            <div>
              <span>Phone</span>
              <a href={`tel:${group.phone.replace(/\s/g, '')}`}>{group.phone}</a>
            </div>
            <div>
              <span>Email</span>
              <a href={`mailto:${group.email}`}>{group.email}</a>
            </div>
            <div>
              <span>Coastal operations</span>
              <span className="line">{group.coast}</span>
            </div>
          </address>
        </div>

        <form className="glass-panel" onSubmit={submit} data-reveal>
          <fieldset className="chips">
            <legend>What is your enquiry about?</legend>
            {enquiryTypes.map((t) => (
              <label key={t.id} className={type === t.id ? 'chip on' : 'chip'}>
                <input type="radio" name="type" value={t.label} checked={type === t.id} onChange={() => { setType(t.id); setStatus('idle'); }} />
                {t.label}
              </label>
            ))}
          </fieldset>

          {type === 'business' && (
            <fieldset className="chips biz">
              <legend>Which business?</legend>
              {businesses.map((b) => (
                <label key={b.id} className={biz === b.id ? 'chip on' : 'chip'} style={{ ['--c' as string]: b.color }}>
                  <input type="radio" name="business" value={b.name} checked={biz === b.id} onChange={() => setBiz(b.id)} />
                  <i />{b.name}
                </label>
              ))}
              <p className="route">
                Your message goes to {business.name} at <b>{business.email}</b>. You can also call {business.phone} or use
                {' '}<a href={business.contactUrl} target="_blank" rel="noopener">its own contact page <Arrow /></a>
              </p>
            </fieldset>
          )}

          <div className="fields">
            <label htmlFor="enq-name"><span>Name</span><input id="enq-name" name="name" required autoComplete="name" /></label>
            <label htmlFor="enq-org"><span>Organisation</span><input id="enq-org" name="organisation" autoComplete="organization" /></label>
            <label htmlFor="enq-email"><span>Email</span><input id="enq-email" name="email" type="email" required autoComplete="email" /></label>
            <label htmlFor="enq-phone"><span>Phone<small>optional</small></span><input id="enq-phone" name="phone" type="tel" autoComplete="tel" /></label>
            <label htmlFor="enq-country" className="wide"><span>Country</span><input id="enq-country" name="country" autoComplete="country-name" /></label>
            <label htmlFor="enq-message" className="wide"><span>Message</span><textarea id="enq-message" name="message" rows={4} required /></label>
          </div>

          <div className="form-foot">
            <button className="btn solid" type="submit" disabled={status === 'sending'} data-magnetic>
              {endpoint ? (status === 'sending' ? 'Sending…' : 'Send enquiry') : 'Open in your email app'} <span aria-hidden="true">→</span>
            </button>
            <p className="form-note" role="status" aria-live="polite">
              {status === 'idle' && !endpoint && 'This opens your email app with the message ready to send.'}
              {status === 'mail' && <>Your email app should now be open. If nothing happened, write to <b>{to}</b>.</>}
              {status === 'sent' && 'Thank you. Your enquiry has been sent.'}
              {status === 'error' && <>The message could not be sent. Please write to <b>{to}</b> instead.</>}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
