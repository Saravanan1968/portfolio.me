import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const N = window.innerWidth < 768 ? 220 : 650
const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x) }

// One target per node per section. Changing section lerps the whole field to the new layout.
function layout(mode, i) {
  const a = rnd(i, 1), b = rnd(i, 2), c = rnd(i, 3)
  switch (mode) {
    case 'profile': { const t = a * 6.283, p = Math.acos(2 * b - 1); return [2.2 * Math.sin(p) * Math.cos(t) + 3, 2.2 * Math.sin(p) * Math.sin(t), 2.2 * Math.cos(p)] }
    case 'work': { const g = i % 3; return [(g - 1) * 4.2 + (a - .5) * 1.8, (b - .5) * 2.2, (c - .5) * 2] }
    case 'stack': { const row = i % 5; return [(a - .5) * 11, (row - 2) * 1.5 + (b - .5) * .3, (c - .5) * 2] }
    case 'journey': { const t = (i / N) * 25; return [(i / N - .5) * 14, Math.sin(t) * 1.3, Math.cos(t) * 1.3] }
    case 'contact': return [(a - .5) * .5, (b - .5) * .5, (c - .5) * .5]
    default: return [(a - .5) * 15, (b - .5) * 8, (c - .5) * 7]
  }
}

function Field({ mode, boost, mouse }) {
  const pts = useRef(), group = useRef()
  const targets = useMemo(() => Object.fromEntries(['home', 'profile', 'work', 'stack', 'journey', 'contact'].map(m => [m, Float32Array.from({ length: N * 3 }, (_, k) => layout(m, Math.floor(k / 3))[k % 3])])), [])
  const geo = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(targets.home), 3)); return g }, [targets])
  const reduce = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  useFrame((_, dt) => {
    const pos = geo.attributes.position.array, tg = targets[mode] || targets.home, k = reduce ? 1 : Math.min(1, dt * 2.2)
    for (let j = 0; j < pos.length; j++) pos[j] += (tg[j] - pos[j]) * k
    geo.attributes.position.needsUpdate = true
    const m = mouse.current
    group.current.rotation.y += (m.x * .35 - group.current.rotation.y) * .04
    group.current.rotation.x += (-m.y * .2 - group.current.rotation.x) * .04
    pts.current.material.size = 0.045 + boost.current * 0.06
  })
  return <group ref={group}><points ref={pts} geometry={geo}><pointsMaterial color="#ECE9E2" size={0.045} sizeAttenuation transparent opacity={0.75} depthWrite={false} /></points></group>
}

export default function Scene({ mode, boost }) {
  const mouse = useRef({ x: 0, y: 0 })
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 9], fov: 50 }} gl={{ antialias: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => addEventListener('pointermove', e => { mouse.current = { x: (e.clientX / innerWidth - .5) * 2, y: (e.clientY / innerHeight - .5) * 2 } })} aria-hidden="true">
      <Field mode={mode} boost={boost} mouse={mouse} />
    </Canvas>
  )
}
