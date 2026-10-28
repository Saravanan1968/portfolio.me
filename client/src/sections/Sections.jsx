import { useState } from 'react'
import { portfolio as P } from '../data/portfolio'

export const Home = ({ onEnter }) => (
  <section id="home" className="sec home">
    <p className="meta">BUILD 2026 · FOCUS FULL-STACK / DATA / APPLIED AI · {P.profile.status.toUpperCase()}</p>
    <h1>{P.profile.name.toUpperCase()}.</h1>
    <p className="role">{P.profile.role}<br />{P.profile.focus}</p>
    <hr />
    <p className="tag">{P.profile.tagline}</p>
    <button className="btn" onClick={onEnter} data-magnetic>Enter system</button>
  </section>
)

export const Profile = () => (
  <section id="profile" className="sec profile">
    <div><p className="meta">PROFILE_01</p><h2>{P.profile.name}</h2><p className="role">{P.profile.role}</p></div>
    <div className="cols">
      <p className="story">{P.profile.story}</p>
      <dl>
        <dt>Education</dt><dd>{P.education.degree}, {P.education.school}, {P.education.place}. {P.education.dates}. {P.education.score}.</dd>
        <dt>Focus</dt><dd>{P.profile.focus}</dd>
        <dt>Currently building</dt><dd>{P.profile.building}</dd>
      </dl>
    </div>
  </section>
)

export function Work({ setHover, boost }) {
  const [open, setOpen] = useState(null), [hov, setHov] = useState(null)
  const cur = P.projects[hov ?? 0]
  return (
    <section id="work" className="sec work">
      <h2 className="giant">WORK</h2>
      <ol className="archive">
        {P.projects.map((p, i) => (
          <li key={p.id}>
            <button data-cursor="view" onMouseEnter={() => { setHov(i); boost.current = 1 }} onMouseLeave={() => { setHov(null); boost.current = 0 }} onFocus={() => setHov(i)} onClick={() => setOpen(i)}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span><span className="ttl">{p.title}</span><span className="sub">{p.sub}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="peek meta" aria-live="polite">PROJECT {String((hov ?? 0) + 1).padStart(2, '0')} · {cur.dates} · {cur.tech.join(' / ')}</p>
      {open !== null && <Detail p={P.projects[open]} i={open} close={() => setOpen(null)} />}
    </section>
  )
}

function Detail({ p, i, close }) {
  return (
    <div className="detail" role="dialog" aria-modal="true" aria-label={p.title}>
      <button className="close" onClick={close}>Close</button>
      <p className="meta">PROJECT {String(i + 1).padStart(2, '0')} · {p.dates}{p.client ? ' · ' + p.client : ''}</p>
      <h3>{p.title}</h3>
      <div className="cols">
        <div><h4>Problem</h4><p>{p.problem}</p><h4>Solution</h4><p>{p.solution}</p>{p.finding && <><h4>Result</h4><p>{p.finding}</p></>}</div>
        <div><h4>Architecture</h4><ol className="flow">{p.flow.map(f => <li key={f}>{f}</li>)}</ol><h4>Technologies</h4><p className="tech">{p.tech.join('  ·  ')}</p></div>
      </div>
    </div>
  )
}

export function Stack() {
  const [sel, setSel] = useState(null)
  return (
    <section id="stack" className="sec stack">
      <h2>Tech stack</h2>
      <div className="map">
        {P.stack.map(l => (
          <div className="layer" key={l.layer}><span className="meta">{l.layer}</span>
            {l.items.map(t => <button key={t.n} className="node" onMouseEnter={() => setSel(t)} onFocus={() => setSel(t)} onClick={() => setSel(t)}>{t.n}</button>)}
          </div>
        ))}
      </div>
      <div className="info" aria-live="polite">{sel ? <><h4>{sel.n}</h4><p>{sel.d}</p><p className="meta">USED FOR: {sel.u}</p></> : <p className="meta">Select a node.</p>}</div>
    </section>
  )
}

export const Journey = () => (
  <section id="journey" className="sec journey">
    <h2>Journey</h2>
    <ol className="versions">{P.versions.map(v => <li key={v.v}><code>{v.v}</code><span className="when">{v.when}</span><div><strong>{v.t}</strong>{v.s && <p>{v.s}</p>}</div></li>)}</ol>
    <h2 className="ach-h">Achievements</h2>
    <ul className="ach">{P.achievements.map(a => <li key={a.big} className={a.hero ? 'hero' : ''}><strong>{a.big}</strong><span>{a.t}</span></li>)}</ul>
  </section>
)

export function Contact() {
  const [s, setS] = useState({ state: 'idle' })
  async function submit(e) {
    e.preventDefault(); setS({ state: 'sending' })
    const body = Object.fromEntries(new FormData(e.target))
    try {
      const r = await fetch((import.meta.env.VITE_API_URL || '') + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await r.json()
      if (j.ok) { e.target.reset(); setS({ state: 'ok' }) } else setS({ state: 'err', errors: j.errors, msg: j.error })
    } catch { setS({ state: 'err', msg: 'Network error. Email me directly.' }) }
  }
  const er = s.errors || {}
  return (
    <section id="contact" className="sec contact">
      <p className="meta">SYSTEM READY.</p>
      <h2 className="giant">Let's build something useful.</h2>
      <form onSubmit={submit} noValidate>
        <label>Name<input name="name" autoComplete="name" />{er.name && <em>{er.name}</em>}</label>
        <label>Email<input name="email" type="email" autoComplete="email" />{er.email && <em>{er.email}</em>}</label>
        <label>Message<textarea name="message" rows="3" />{er.message && <em>{er.message}</em>}</label>
        <button className="btn" disabled={s.state === 'sending'} data-magnetic>{s.state === 'sending' ? 'Sending…' : 'Send message'}</button>
        <p role="status">{s.state === 'ok' && 'Message sent.'}{s.msg}</p>
      </form>
      <p className="links"><a href={`mailto:${P.social.email}`}>{P.social.email}</a><a href={P.social.github} target="_blank" rel="noreferrer">GitHub</a><a href={P.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></p>
    </section>
  )
}
