import { useEffect, useState } from 'react'
const LINES = ['PROFILE', 'PROJECTS', 'EXPERIENCE', 'SKILLS']
export default function Intro({ onDone }) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setP(v => Math.min(100, v + 5)), 70)
    return () => clearInterval(t)
  }, [])
  useEffect(() => { if (p >= 100) { const t = setTimeout(onDone, 250); return () => clearTimeout(t) } }, [p])
  return (
    <div className="intro" role="status">
      <pre>{p < 100 ? 'INITIALIZING PERSONAL SYSTEM...' : 'SYSTEM READY'}{'\n\n'}[{'█'.repeat(Math.round(p / 5)).padEnd(20, '░')}] {p}%{'\n\n'}{LINES.filter((_, i) => p > i * 25).map(l => 'LOADING ' + l).join('\n')}</pre>
      <button onClick={onDone}>Skip</button>
    </div>
  )
}
