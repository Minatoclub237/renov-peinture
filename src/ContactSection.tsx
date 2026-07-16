import type React from 'react'
import { useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'motion/react'
import {
  ArrowRight,
  Check,
  Mail,
  MapPin,
  Navigation2,
  Phone,
  Star,
} from 'lucide-react'

export const MAPS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=19+rue+Jean+Cocteau+13110+Port-de-Bouc+France'
export const CONTACT_EMAIL = 'renovpeinture13@gmail.com'

const PROJETS = [
  'Peinture intérieure / extérieure',
  'Rénovation intérieure / extérieure',
  'Ravalement de façade',
  'Pose de Placo',
  'Maçonnerie générale',
  'Revêtement de sol',
  'Autre',
]

const FIELD_CLASSES =
  'w-full bg-transparent border-b border-gray-300 focus:border-[#FF5C35] outline-none py-3 text-base text-gray-900 placeholder:text-gray-400 transition-colors rounded-none'

function Label({ children, htmlFor }: { children: string; htmlFor: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500"
    >
      {children}
    </label>
  )
}

function LocationMap({
  location = 'Port-de-Bouc, France',
  coordinates = '43.4058° N, 4.9886° E',
}: {
  location?: string
  coordinates?: string
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8])
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8])

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative cursor-pointer select-none"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-[#161616] border border-white/10"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          width: isExpanded ? 360 : 240,
          height: isExpanded ? 280 : 140,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.08]" />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-white/[0.06]" />

              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <motion.line
                  x1="0%"
                  y1="35%"
                  x2="100%"
                  y2="35%"
                  className="stroke-white/25"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                <motion.line
                  x1="0%"
                  y1="65%"
                  x2="100%"
                  y2="65%"
                  className="stroke-white/25"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                <motion.line
                  x1="30%"
                  y1="0%"
                  x2="30%"
                  y2="100%"
                  className="stroke-white/20"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
                <motion.line
                  x1="70%"
                  y1="0%"
                  x2="70%"
                  y2="100%"
                  className="stroke-white/20"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                />
                {[20, 50, 80].map((y, i) => (
                  <motion.line
                    key={`h-${i}`}
                    x1="0%"
                    y1={`${y}%`}
                    x2="100%"
                    y2={`${y}%`}
                    className="stroke-white/10"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  />
                ))}
                {[15, 45, 55, 85].map((x, i) => (
                  <motion.line
                    key={`v-${i}`}
                    x1={`${x}%`}
                    y1="0%"
                    x2={`${x}%`}
                    y2="100%"
                    className="stroke-white/10"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  />
                ))}
              </svg>

              {[
                'top-[40%] left-[10%] w-[15%] h-[20%]',
                'top-[15%] left-[35%] w-[12%] h-[15%]',
                'top-[70%] left-[75%] w-[18%] h-[18%]',
                'top-[20%] right-[10%] w-[10%] h-[25%]',
                'top-[55%] left-[5%] w-[8%] h-[12%]',
                'top-[8%] left-[75%] w-[14%] h-[10%]',
              ].map((cls, i) => (
                <motion.div
                  key={cls}
                  className={`absolute ${cls} rounded-sm bg-white/20 border border-white/10`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                />
              ))}

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                  delay: 0.3,
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(255, 92, 53, 0.5))',
                  }}
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill="#FF5C35"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="#161616" />
                </svg>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-60" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isExpanded ? 0 : 0.03 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern
                id="loc-grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  className="stroke-white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#loc-grid)" />
          </svg>
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            <motion.div
              animate={{ opacity: isExpanded ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#FF5C35]"
                animate={{
                  filter: isHovered
                    ? 'drop-shadow(0 0 8px rgba(255, 92, 53, 0.6))'
                    : 'drop-shadow(0 0 4px rgba(255, 92, 53, 0.3))',
                }}
                transition={{ duration: 0.3 }}
              >
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" x2="9" y1="3" y2="18" />
                <line x1="15" x2="15" y1="6" y2="21" />
              </motion.svg>
            </motion.div>

            <motion.div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 backdrop-blur-sm"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[10px] font-medium text-white/50 tracking-wide uppercase">
                Ouvert 6j/7
              </span>
            </motion.div>
          </div>

          <div className="space-y-1">
            <motion.h3
              className="text-white font-medium text-sm tracking-tight"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {location}
            </motion.h3>

            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  className="text-white/50 text-xs font-mono"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {coordinates}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              className="h-px bg-gradient-to-r from-[#FF5C35]/50 via-[#FF5C35]/30 to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      <motion.p
        className="absolute -bottom-6 left-1/2 text-[10px] text-gray-400 whitespace-nowrap"
        style={{ x: '-50%' }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered && !isExpanded ? 1 : 0,
          y: isHovered ? 0 : 4,
        }}
        transition={{ duration: 0.2 }}
      >
        Cliquez pour agrandir
      </motion.p>
    </motion.div>
  )
}

export default function ContactSection() {
  const [sent, setSent] = useState(false)

  return (
    // Le -mt + grands coins arrondis font "glisser" le blanc sur la section
    // sombre : transition marquée, pas une simple ligne
    <section
      id="contact"
      className="relative z-30 -mt-16 bg-[#BFD4EE] text-gray-900 rounded-t-[4rem] py-24 lg:py-32 shadow-[0_-30px_60px_rgba(0,0,0,0.35)] overflow-hidden"
    >
      {/* Vidéo de fond en boucle */}
      <video
        src="/media/contact-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 max-w-[1180px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-20">
        {/* Fiche entreprise */}
        <div className="flex flex-col gap-7">
          <div>
            <p className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-3">
              Contact
            </p>
            <h2 className="font-display font-bold text-[clamp(40px,5.5vw,76px)] leading-[0.95] tracking-tight">
              Un projet ?<br />
              Parlons-en.
            </h2>
          </div>

          {/* Note Google */}
          <div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold">5,0</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-[#FBBC04] text-[#FBBC04]"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">1 avis Google</span>
            </div>
            <p className="text-gray-500 mt-1">
              Peintre en bâtiment à Port-de-Bouc, France
            </p>
          </div>

          {/* Coordonnées */}
          <div className="flex flex-col gap-4 text-[15px]">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#FF5C35] mt-0.5 shrink-0" />
              <span className="text-gray-700">
                19 rue Jean Cocteau, 13110 Port-de-Bouc, France
              </span>
            </div>
            <a
              href="tel:+33662903358"
              className="group flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Phone size={18} className="text-[#FF5C35] shrink-0" />
              <span className="font-semibold">06 62 90 33 58</span>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Mail size={18} className="text-[#FF5C35] shrink-0" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>

          {/* Horaires */}
          <div className="border-t border-gray-900/15 pt-5 grid grid-cols-2 gap-2 max-w-sm text-sm">
            <span className="text-gray-500">Lundi – Samedi</span>
            <span className="text-gray-900 font-medium">07:00 – 18:00</span>
            <span className="text-gray-500">Dimanche</span>
            <span className="text-gray-900 font-medium">Fermé</span>
          </div>

          {/* Itinéraire */}
          <div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-900 rounded-full px-6 py-2.5 text-sm font-medium shadow-sm hover:border-gray-400 transition-colors"
            >
              <Navigation2 size={15} className="text-[#1A73E8]" />
              Itinéraire
            </a>
          </div>

          {/* Carte interactive */}
          <div className="pt-4">
            <LocationMap />
          </div>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            const subject = encodeURIComponent(
              `Demande de devis — ${data.get('projet') || 'Projet'}`
            )
            const body = encodeURIComponent(
              `Nom : ${data.get('nom')}\nTéléphone : ${data.get('tel')}\nEmail : ${data.get('email') || '—'}\nType de projet : ${data.get('projet') || '—'}\n\n${data.get('message')}`
            )
            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
            setSent(true)
          }}
          className="flex flex-col gap-8 bg-white/75 backdrop-blur-md border border-white/60 rounded-3xl p-7 lg:p-10 shadow-xl self-start w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-1">
              <Label htmlFor="nom">Nom</Label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                placeholder="Votre nom"
                className={FIELD_CLASSES}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="tel">Téléphone</Label>
              <input
                id="tel"
                name="tel"
                type="tel"
                required
                placeholder="06 12 34 56 78"
                className={FIELD_CLASSES}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="vous@exemple.fr"
              className={FIELD_CLASSES}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="projet">Type de projet</Label>
            <select
              id="projet"
              name="projet"
              className={`${FIELD_CLASSES} cursor-pointer appearance-none`}
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionnez une prestation
              </option>
              {PROJETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              placeholder="Décrivez votre projet : surfaces, délais, ville…"
              className={`${FIELD_CLASSES} resize-none`}
            />
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.p
                key="ok"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-green-600 font-medium"
              >
                <span className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={16} />
                </span>
                Merci ! Votre messagerie s’ouvre pour finaliser l’envoi —
                sinon écrivez-nous à {CONTACT_EMAIL}.
              </motion.p>
            ) : (
              <motion.button
                key="btn"
                exit={{ opacity: 0, y: -10 }}
                type="submit"
                className="group self-start bg-gray-900 text-white rounded-full pl-7 pr-2 py-2 flex items-center gap-3 text-base font-medium hover:bg-[#FF5C35] transition-colors"
              >
                Envoyer ma demande
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                  <ArrowRight
                    size={16}
                    className="text-gray-900 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  )
}
