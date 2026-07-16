import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, Play, X } from 'lucide-react'
import Hls from 'hls.js'
import AtoutsSection from './AtoutsSection'
import PrestationsSection from './PrestationsSection'
import ContactSection from './ContactSection'
import Footer from './Footer'

const VIDEO_URL =
  'https://www.image2url.com/r2/default/videos/1784131052417-907237f8-10c2-43dd-bdd3-f48fdeb4b84e.mp4'

// Media time (seconds) of the frame where RENOV appears, and the wall color it uses
const RENOV_REVEAL_TIME = 7.2
const RENOV_COLOR = '#AD7A61'

const NAV_LINKS = [
  { label: 'À propos', href: '#atouts' },
  { label: 'Services', href: '#prestations' },
  { label: 'Contact', href: '#contact' },
]

const SUPPLIERS = [
  { file: 'pointp', name: 'Point.P' },
  { file: 'tollens', name: 'Tollens' },
  { file: 'jefco', name: 'Jefco Peintures' },
  { file: 'sfic', name: 'SFIC' },
  { file: 'bernard-philibert', name: 'Bernard Philibert' },
]
// Duplicated reel: the marquee animates -50%, so the strip must be two identical halves
const SUPPLIER_REEL = [...SUPPLIERS, ...SUPPLIERS]

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#" className="flex items-center gap-3">
      <img
        src="/media/logo.webp"
        alt="Logo RENOV PEINTURE"
        className="w-9 h-9 md:w-10 md:h-10 object-contain"
      />
      <span
        className={`text-lg md:text-xl font-black tracking-tighter ${
          dark ? 'text-gray-900' : 'text-white'
        }`}
      >
        RENOV PEINTURE
      </span>
    </a>
  )
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showRenov, setShowRenov] = useState(false)

  // Frame-accurate reveal of the RENOV wordmark, re-armed on every video loop
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let rafId: number
    const tick = () => {
      setShowRenov(video.currentTime >= RENOV_REVEAL_TIME)
      rafId = video.requestVideoFrameCallback(tick)
    }
    rafId = video.requestVideoFrameCallback(tick)
    return () => video.cancelVideoFrameCallback(rafId)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // HLS path for .m3u8 manifests; the current source is a plain .mp4,
    // which every browser plays natively — hls.js would choke parsing it.
    if (VIDEO_URL.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(VIDEO_URL)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.playbackRate = 0.7
        video.play()
      })
      return () => hls.destroy()
    }

    // Safari / native fallback
    video.src = VIDEO_URL
    const onLoaded = () => {
      video.playbackRate = 0.7
      video.play()
    }
    video.addEventListener('loadedmetadata', onLoaded)
    return () => video.removeEventListener('loadedmetadata', onLoaded)
  }, [])

  return (
    <>
    <div
      id="accueil"
      className="relative h-screen w-full font-sans text-white selection:bg-white/20 overflow-hidden bg-black"
    >
      {/* ── 1. Background video ─────────────────────────────── */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1] z-0"
      />

      {/* SVG mask definition — RENOV letters punch a clear hole in the blur layer */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <mask id="emberMask">
            <rect width="100%" height="100%" fill="white" />
            {/* Mobile variant */}
            <text
              x="0"
              y="115"
              textLength="100%"
              lengthAdjust="spacingAndGlyphs"
              className="font-[900] tracking-tighter lg:hidden"
              style={{ fontSize: '90px' }}
              fill="black"
            >
              RENOV
            </text>
            {/* Desktop variant */}
            <text
              x="0"
              y="115"
              textLength="100%"
              lengthAdjust="spacingAndGlyphs"
              className="font-[900] tracking-tighter hidden lg:inline"
              style={{ fontSize: '130px' }}
              fill="black"
            >
              RENOV
            </text>
          </mask>
        </defs>
      </svg>

      {/* ── 2. Split panels ─────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col lg:flex-row z-10 pointer-events-none overflow-y-auto lg:overflow-hidden scrollbar-hide">
        {/* Left panel — RENOV cutout */}
        <div className="relative w-full lg:w-1/2 min-h-screen lg:h-full flex flex-col pointer-events-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
          {/* Blur layer with letter cutout */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(131, 131, 131, 0.3)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              maskImage: 'url(#emberMask)',
              WebkitMaskImage: 'url(#emberMask)',
            }}
          />

          {/* Content stack */}
          <div className="relative z-20 flex flex-col h-full pt-[12vh] lg:pt-[8vh] px-6 md:px-12">
            {/* Spacer reserving the RENOV wordmark zone */}
            <div className="h-[20vh] lg:h-[25vh] shrink-0" />

            {/* Vertical line */}
            <div className="flex-grow flex flex-col pt-4 min-h-[100px]">
              <div className="w-[1px] h-full bg-white/20" />
            </div>

            {/* Hero copy block */}
            <div className="pb-12 flex flex-col gap-5 pt-4">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-600">
                Renov Peinture
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15] text-gray-900 max-w-md">
                Murs impeccables, esprit tranquille. Partout.
              </h1>
              <div className="flex items-center gap-5 pt-2">
                <a
                  href="tel:+33662903358"
                  className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
                >
                  Réservation
                </a>
                <a
                  href="#prestations"
                  className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <Play size={14} className="fill-current" />
                  Voir nos réalisations
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — PEINTURE word */}
        <div className="relative w-full lg:w-1/2 min-h-[50vh] lg:h-full flex flex-col justify-end pb-8 lg:pb-2 pointer-events-auto overflow-hidden">
          {/* Decorative concentric circles */}
          <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
            <div className="relative h-full aspect-square flex flex-col items-center">
              <div className="absolute top-[-10vh] lg:top-[-25vh] w-[40vh] lg:w-[60vh] h-[40vh] lg:h-[60vh] border border-white/20 lg:border-white/35 rounded-full" />
              <div className="absolute top-[30vh] lg:top-[18vh] w-[40vh] lg:w-[60vh] h-[40vh] lg:h-[60vh] border border-white/20 lg:border-white/35 rounded-full" />
            </div>
          </div>

          {/* RENOV — appears when the video reaches its reveal frame */}
          <div className="relative z-10 w-full px-6 md:px-[5%]">
            <AnimatePresence>
              {showRenov && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <svg
                    viewBox="0 0 1000 190"
                    className="w-full"
                    preserveAspectRatio="xMidYMax meet"
                    aria-label="RENOV"
                  >
                    <text
                      x="0"
                      y="175"
                      textLength="1000"
                      lengthAdjust="spacingAndGlyphs"
                      className="font-[900] tracking-tighter"
                      style={{ fontSize: '175px' }}
                      fill={RENOV_COLOR}
                    >
                      RENOV
                    </text>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PEINTURE wordmark */}
          <div className="relative z-10 w-full mb-1 px-6 md:px-[5%]">
            <svg
              viewBox="0 0 1000 190"
              className="w-full"
              preserveAspectRatio="xMidYMax meet"
              aria-label="PEINTURE"
            >
              <text
                x="0"
                y="175"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                className="font-[900] tracking-tighter"
                style={{ fontSize: '175px' }}
                fill="white"
              >
                PEINTURE
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* ── 3. Navigation — pill nav ────────────────────────── */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
        <div className="flex items-center">
          <Logo dark={isMenuOpen} />
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-gray-900 rounded-full px-2 py-1.5 items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 text-sm font-medium px-4 py-1.5 rounded-full hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden md:flex bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-full items-center gap-2 hover:bg-gray-700 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
          Devis gratuit
        </a>

        <button
          className={`md:hidden p-1 ${isMenuOpen ? 'text-gray-900' : 'text-white'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── 4. Mobile dropdown ──────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-40 bg-white pt-16 pb-6 px-5 shadow-lg flex flex-col gap-1 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-800 text-base font-medium py-3 border-b border-gray-100 text-left hover:text-gray-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full flex items-center gap-2 justify-center hover:bg-gray-700 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
              Devis gratuit
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* ── 5. Les Fournisseurs — bande logos défilante ─────── */}
    <section
      id="fournisseurs"
      className="bg-white text-black font-sans py-16 lg:py-24 overflow-hidden"
    >
      <div className="text-center px-6 mb-12 lg:mb-16">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
          Les Fournisseurs
        </h2>
        <p className="mt-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-black/50">
          Fruit de notre expérience et dont la qualité est indiscutable
        </p>
      </div>
      <div className="marquee flex w-max items-center">
        {SUPPLIER_REEL.map((s, i) => (
          <img
            key={i}
            src={`/media/fournisseurs/${s.file}.webp`}
            alt={s.name}
            className="h-12 md:h-16 w-auto mx-8 md:mx-14 shrink-0"
          />
        ))}
      </div>
    </section>

    {/* ── 6. Nos Atouts ───────────────────────────────────── */}
    <AtoutsSection />

    {/* ── 7. Prestations — recouvre la section précédente ──── */}
    <PrestationsSection />

    {/* ── 8. Contact — fiche + formulaire sur fond blanc ─────── */}
    <ContactSection />

    {/* ── 9. Footer ───────────────────────────────────────────── */}
    <Footer />
    </>
  )
}
