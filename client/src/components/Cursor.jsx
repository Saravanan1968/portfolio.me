import { useEffect, useRef, useState } from 'react'
// Small dot that grows on interactive elements and reads VIEW over [data-cursor="view"]. Hidden on touch.
export default function Cursor() {
  const el = useRef(), [label, setLabel] = useState(''), [big, setBig] = useState(false)
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return
    const move = e => { el.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)` }
    const over = e => { const t = e.target.closest('a,button,input,textarea,[data-cursor]'); setBig(!!t); setLabel(t?.dataset.cursor === 'view' ? 'VIEW' : '') }
    addEventListener('pointermove', move); addEventListener('pointerover', over)
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerover', over) }
  }, [])
  return <div ref={el} className="cursor" aria-hidden="true"><span className={big ? 'big' : ''}>{label}</span></div>
}
