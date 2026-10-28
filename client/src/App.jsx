import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Cursor from './components/Cursor'
import Intro from './components/Intro'
import { Home, Profile, Work, Stack, Journey, Contact } from './sections/Sections'
import { useActiveSection } from './hooks/useActiveSection'
import { hasWebGL } from './utils/webgl'
const Scene = lazy(() => import('./three/Scene'))
const NAV = ['home', 'profile', 'work', 'stack', 'journey', 'contact']

export default function App() {
  const [booted, setBooted] = useState(sessionStorage.getItem('booted') === '1')
  const active = useActiveSection(NAV)
  const boost = useRef(0)
  const gl = useRef(hasWebGL()).current
  const done = () => { sessionStorage.setItem('booted', '1'); setBooted(true) }
  // Magnetic buttons: pull toward the pointer within a small radius.
  useEffect(() => {
    const m = e => document.querySelectorAll('[data-magnetic]').forEach(b => {
      const r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
      b.style.transform = Math.hypot(dx, dy) < 120 ? `translate(${dx * .25}px,${dy * .25}px)` : ''
    })
    addEventListener('pointermove', m); return () => removeEventListener('pointermove', m)
  }, [booted])
  if (!booted) return <Intro onDone={done} />
  const idx = NAV.indexOf(active)
  const go = id => document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
  return (
    <>
      <Cursor />
      <div className={gl ? 'bg' : 'bg static'}>{gl && <Suspense fallback={null}><Scene mode={active} boost={boost} /></Suspense>}</div>
      <nav aria-label="Sections">
        {NAV.map((id, i) => <button key={id} className={id === active ? 'on' : ''} onClick={() => go(id)}><span>{String(i + 1).padStart(2, '0')}</span>{id}</button>)}
        <i style={{ height: `${((idx + 1) / NAV.length) * 100}%` }} />
      </nav>
      <main>
        <Home onEnter={() => go('profile')} /><Profile /><Work boost={boost} /><Stack /><Journey /><Contact />
      </main>
    </>
  )
}
