import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react'

const PRESTATIONS = [
  { slug: 'peinture', title: 'Peinture intérieure et extérieure' },
  { slug: 'renovation', title: 'Rénovation intérieure et extérieure' },
  { slug: 'facade', title: 'Ravalement de façade' },
  { slug: 'placo', title: 'Pose du Placo (plaques de plâtre)' },
  { slug: 'maconnerie', title: 'Maçonnerie générale' },
  {
    slug: 'sols',
    title: 'Revêtement de sol dur et souple (carrelage, parquet, PVC/lino)',
  },
]

function BeforeAfter({
  slug,
  title,
  index,
}: {
  slug: string
  title: string
  index: number
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [pos, setPos] = useState(50)

  const updateFromClientX = (clientX: number) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos(Math.min(98, Math.max(2, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div className="shrink-0 w-[85vw] sm:w-[62vw] lg:w-[44vw]">
      <div
        ref={frameRef}
        className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-black select-none cursor-ew-resize"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          updateFromClientX(e.clientX)
        }}
        onPointerMove={(e) => {
          if (dragging.current) updateFromClientX(e.clientX)
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
        onPointerCancel={() => {
          dragging.current = false
        }}
      >
        {/* Après (fond) */}
        <img
          src={`/media/prestations/${slug}-apres.webp`}
          alt={`${title} — après`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          loading="lazy"
        />
        {/* Avant (révélé par la poignée) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={`/media/prestations/${slug}-avant.webp`}
            alt={`${title} — avant`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            loading="lazy"
          />
        </div>

        {/* Libellés */}
        <span className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.25em] uppercase text-white drop-shadow">
          Avant
        </span>
        <span className="absolute top-4 right-4 text-[10px] font-bold tracking-[0.25em] uppercase text-white drop-shadow">
          Après
        </span>

        {/* Ligne + poignée */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white/90 -translate-x-1/2"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FF5C35] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <MoveHorizontal size={18} className="text-white" />
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-4">
        <span className="font-mono text-xs text-white/40 shrink-0">
          0{index + 1}
        </span>
        <h3 className="font-display font-semibold text-xl md:text-2xl leading-tight text-white">
          {title}
        </h3>
      </div>
    </div>
  )
}

export default function PrestationsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)

  // Défilement horizontal piloté par le scroll vertical (section épinglée) :
  // les cartes traversent l'écran de droite à gauche
  useEffect(() => {
    let raf = 0
    let smooth = 0
    const tick = () => {
      const track = trackRef.current
      const row = rowRef.current
      if (track && row && row.parentElement) {
        const rect = track.getBoundingClientRect()
        const vh = window.innerHeight
        const scrollable = rect.height - vh
        const raw =
          scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
        smooth += (raw - smooth) * 0.14
        if (Math.abs(raw - smooth) < 0.0005) smooth = raw
        const max = row.scrollWidth - row.parentElement.clientWidth
        row.style.transform = `translateX(${-smooth * Math.max(0, max)}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Flèches : fait glisser d'une carte à l'autre en pilotant le scroll
  // vertical qui anime le défilement horizontal
  const goTo = (dir: 1 | -1) => {
    const track = trackRef.current
    const row = rowRef.current
    if (!track || !row || !row.parentElement || row.children.length < 2) return
    const rect = track.getBoundingClientRect()
    const vh = window.innerHeight
    const scrollable = rect.height - vh
    const max = row.scrollWidth - row.parentElement.clientWidth
    if (scrollable <= 0 || max <= 0) return
    const step =
      (row.children[1] as HTMLElement).offsetLeft -
      (row.children[0] as HTMLElement).offsetLeft
    const p = Math.min(1, Math.max(0, -rect.top / scrollable))
    const idx = Math.round((p * max) / step)
    const nextIdx = Math.min(PRESTATIONS.length - 1, Math.max(0, idx + dir))
    const targetShift = Math.min(max, nextIdx * step)
    const trackTop = window.scrollY + rect.top
    window.scrollTo({
      top: trackTop + (targetShift / max) * scrollable,
      behavior: 'smooth',
    })
  }

  return (
    // -mt-[100dvh] : la section recouvre le dernier viewport de la section
    // précédente (vidéo encore épinglée) → effet de recouvrement au scroll
    <section
      id="prestations"
      className="relative z-20 -mt-[100dvh] bg-[#101010] text-white rounded-t-[2.5rem] shadow-[0_-40px_80px_rgba(0,0,0,0.55)]"
    >
      <div ref={trackRef} className="relative h-[420vh]">
        <div className="sticky top-0 h-dvh overflow-hidden flex flex-col justify-center gap-8 md:gap-12 py-10">
          {/* En-tête */}
          <div className="px-6 md:px-12 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-3">
                Renov Peinture
              </p>
              <h2 className="font-display font-bold text-[clamp(44px,7vw,96px)] leading-[0.95] tracking-tight">
                Prestations
              </h2>
            </div>
            <p className="hidden md:block font-mono text-xs text-white/40 pb-3">
              ( 06 )
            </p>
          </div>

          {/* Rangée horizontale */}
          <div className="overflow-hidden">
            <div
              ref={rowRef}
              className="flex gap-6 md:gap-10 px-6 md:px-12 w-max will-change-transform"
            >
              {PRESTATIONS.map((p, i) => (
                <BeforeAfter key={p.slug} slug={p.slug} title={p.title} index={i} />
              ))}
            </div>
          </div>

          {/* Flèches de navigation */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => goTo(-1)}
              className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Prestation précédente"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goTo(1)}
              className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Prestation suivante"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
