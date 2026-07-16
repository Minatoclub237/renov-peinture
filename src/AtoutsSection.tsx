import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'

const GLYPHS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><'

// Les 5 atouts de la maquette d'origine, chacun avec sa couleur de pastille
const ATOUTS = [
  {
    color: '#EF4444',
    title: 'EXPÉRIENCE',
    value: '28 ans',
    footer: "PLUS DE 28 ANS D'EXPÉRIENCE",
    details: [
      'Installée à Port-de-Bouc (13110)',
      'Particuliers et professionnels',
      'Département des Bouches-du-Rhône',
    ],
  },
  {
    color: '#F97316',
    title: 'QUALITÉ / PRIX',
    value: 'Juste',
    footer: 'TRÈS BON RAPPORT QUALITÉ PRIX',
    details: [
      'Devis et solutions sur-mesure',
      'Conseils de nos experts',
      'Travail soigné, prix maîtrisés',
    ],
  },
  {
    color: '#22C55E',
    title: 'ACCOMPAGNEMENT',
    value: 'Suivi',
    footer: 'ACCOMPAGNEMENT ET ÉCOUTE',
    details: [
      'À l’écoute de vos besoins',
      'Au gré de vos envies',
      'Conseils à chaque étape',
    ],
  },
  {
    color: '#2563EB',
    title: 'INTERVENTION',
    value: 'Rapide',
    footer: 'INTERVENTION RAPIDE',
    details: [
      'Peinture et Placo',
      'Maçonnerie générale',
      'Revêtements de sol',
    ],
  },
  {
    color: '#A855F7',
    title: 'DÉLAIS',
    value: 'Tenus',
    footer: 'RESPECT DES DÉLAIS',
    details: [
      'Remise en état ou décoration',
      'Chantiers organisés',
      'Artisans qualifiés',
    ],
  },
]

function ScrambleLine({
  text,
  delay = 0,
  start,
}: {
  text: string
  delay?: number
  start: boolean
}) {
  const [display, setDisplay] = useState(' '.repeat(text.length))

  useEffect(() => {
    if (!start) return
    let raf = 0
    let begin: number | null = null
    const duration = 900
    const timer = setTimeout(() => {
      const tick = (now: number) => {
        if (begin === null) begin = now
        const t = Math.min(1, (now - begin) / duration)
        let result = ''
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            result += ' '
            continue
          }
          const threshold = i / text.length
          if (t >= threshold + 0.15) result += text[i]
          else if (t >= threshold - 0.1)
            result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          else result += ' '
        }
        setDisplay(t >= 1 ? text : result)
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [start, text, delay])

  return <span className="inline-block">{display}</span>
}

const TITLE_CLASSES =
  'flex flex-col font-light leading-[0.95] tracking-[-0.03em] text-[clamp(50px,8vw,100px)] select-none'

export default function AtoutsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const cinematicRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [statsRevealed, setStatsRevealed] = useState(false)

  // Déclenche le scramble des titres à l'entrée de la section
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Révélation du carrousel
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsRevealed(true)
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Vidéo de fond scrubbée : le scroll de la section pilote currentTime
  // (comportement du template d'origine), avec lissage
  useEffect(() => {
    let raf = 0
    let smooth = 0

    const tick = () => {
      const section = sectionRef.current
      const video = videoRef.current
      if (section && video) {
        const rect = section.getBoundingClientRect()
        const vh = window.innerHeight
        const scrollable = rect.height - vh
        const raw =
          scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
        smooth += (raw - smooth) * 0.12
        if (Math.abs(raw - smooth) < 0.0005) smooth = raw

        if (video.readyState >= 1 && video.duration > 0 && !video.seeking) {
          const target = Math.min(
            video.duration - 0.05,
            smooth * video.duration
          )
          if (Math.abs(video.currentTime - target) > 0.01)
            video.currentTime = target
        }
      }

      // Parallaxe 3D du bloc cinématique (rotateX + fondu, comme le template)
      const cin = cinematicRef.current
      if (cin) {
        const rect = cin.getBoundingClientRect()
        const vh = window.innerHeight
        const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)))
        let op = 0
        if (p <= 0.15) op = p / 0.15
        else if (p <= 0.85) op = 1
        else op = 1 - (p - 0.85) / 0.15
        op = Math.max(0, Math.min(1, op))
        cin.style.opacity = String(op)
        cin.style.transform = `rotateX(${24 - 24 * p}deg) translateY(${-60 * p}px)`
        cin.style.pointerEvents = op > 0.2 ? 'auto' : 'none'
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section
      id="atouts"
      ref={sectionRef}
      className="relative bg-[#D8CCBD] text-gray-900 font-mono"
    >
      {/* Vidéo de fond — opacité 100%, épinglée derrière toute la section,
          avance au rythme du scroll. Sticky en flux normal + marge négative :
          fiable aussi sur mobile, contrairement au sticky dans un wrapper absolute */}
      <div className="sticky top-0 h-dvh -mb-[100dvh] overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="/media/atouts-bg.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Grille de points */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Contenu en flux normal par-dessus la vidéo */}
      <div className="relative z-10 py-20 lg:py-28">
        {/* Titre scramble */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 min-h-[70vh] flex flex-col justify-end gap-12">
          <h2 className={`${TITLE_CLASSES} md:items-end md:text-right`}>
            <ScrambleLine text="Pourquoi" delay={200} start={inView} />
            <ScrambleLine text="Nous" delay={350} start={inView} />
            <ScrambleLine text="Choisir ?" delay={500} start={inView} />
          </h2>
        </div>

        {/* Bloc cinématique — deux paragraphes + CTA dans le même élément */}
        <div
          className="max-w-[1024px] mx-auto px-6 pt-32 pb-24"
          style={{ perspective: '400px' }}
        >
          <div
            ref={cinematicRef}
            className="text-center flex flex-col items-center gap-10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <p className="font-bold text-[clamp(22px,3.5vw,42px)] leading-[1.35] tracking-[-0.02em] px-6">
              Installée à Port-de-Bouc (13110), notre entreprise de rénovation
              répond aux besoins des particuliers et des professionnels dans le
              département des Bouches-du-Rhône. Spécialisés dans ce domaine
              depuis de nombreuses années, nous intervenons pour remettre en
              état ou décorer votre bâtiment au gré de vos envies et de vos
              besoins. Faites appel à nos artisans pour tous travaux de
              peinture, de Placo, de maçonnerie générale et de revêtements de
              sol.
            </p>
            <p className="font-bold text-[clamp(22px,3.5vw,42px)] leading-[1.35] tracking-[-0.02em] px-6">
              Pour en savoir plus sur nos réalisations, obtenir des conseils de
              nos experts et des solutions sur-mesure avec un devis,
              n’hésitez pas à nous joindre au{' '}
              <a
                href="tel:+33662903358"
                className="whitespace-nowrap underline decoration-black/30 underline-offset-8 hover:decoration-black transition-colors"
              >
                06 62 90 33 58
              </a>{' '}
              ou via le formulaire de contact.
            </p>
            <a
              href="#contact"
              className="bg-gray-900 text-white rounded-full pl-2 pr-7 py-2 flex items-center gap-3 font-sans text-base font-medium hover:bg-gray-700 transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <ArrowRight size={16} className="text-gray-900" />
              </span>
              Contactez nous
            </a>
          </div>
        </div>

        {/* Carrousel des atouts — cartes du template */}
        <div
          ref={statsRef}
          className={`relative transition-all duration-700 ease-out ${
            statsRevealed
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-10 scale-[0.98]'
          }`}
        >
          <Swiper
            modules={[EffectCoverflow, Navigation]}
            effect="coverflow"
            grabCursor
            slidesPerView="auto"
            centeredSlides
            loop
            navigation={{ prevEl: '.atouts-prev', nextEl: '.atouts-next' }}
            spaceBetween={32}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            className="atouts-swiper"
          >
            {ATOUTS.map((card) => (
              <SwiperSlide key={card.title}>
                <div className="p-1.5 rounded-[28px] bg-white/20 backdrop-blur-xl flex flex-col justify-between h-full">
                  <div className="bg-black/45 border border-white/5 backdrop-blur-xl rounded-[23px] p-8 flex flex-col justify-between flex-1 text-white">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                          {card.title}
                        </span>
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: card.color }}
                        />
                      </div>
                      <div className="text-[clamp(60px,6vw,76px)] font-normal tracking-[-0.04em] leading-none mt-6">
                        {card.value}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-4">
                      {card.details.map((d) => (
                        <div
                          key={d}
                          className="flex items-start gap-2 text-[11px] font-medium text-white/60"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1 shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 pt-3 pb-2.5 text-[10px] font-medium text-black/70 uppercase tracking-[0.1em] whitespace-nowrap overflow-hidden text-ellipsis">
                    {card.footer}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Flèches de navigation */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              className="atouts-prev w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
              aria-label="Carte précédente"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="atouts-next w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
              aria-label="Carte suivante"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Piste de sortie : la vidéo reste épinglée un viewport de plus,
            le temps que la section suivante vienne la recouvrir */}
        <div className="h-[100dvh]" aria-hidden="true" />
      </div>
    </section>
  )
}
