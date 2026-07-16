import { MapPin, Phone, Star, Navigation2 } from 'lucide-react'
import { MAPS_URL } from './ContactSection'

const NAV = [
  { label: 'À propos', href: '#atouts' },
  { label: 'Services', href: '#prestations' },
  { label: 'Contact', href: '#contact' },
]

const SERVICES = [
  'Peinture intérieure & extérieure',
  'Rénovation intérieure & extérieure',
  'Ravalement de façade',
  'Pose de Placo',
  'Maçonnerie générale',
  'Revêtements de sol',
]

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr] gap-10">
          {/* Marque */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 self-start"
              aria-label="Revenir en haut de page"
            >
              <img
                src="/media/logo.webp"
                alt="Logo RENOV PEINTURE"
                className="w-10 h-10 object-contain"
              />
              <span className="text-lg font-black tracking-tighter">
                RENOV PEINTURES
              </span>
            </button>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Peintre en bâtiment à Amiens. Peinture, rénovation, ravalement de
              façade, Placo, maçonnerie générale et revêtements de sol, pour
              particuliers et professionnels.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">5,0</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="fill-[#FBBC04] text-[#FBBC04]"
                  />
                ))}
              </div>
              <span className="text-xs text-white/40">1 avis Google</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            <p className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">
              Navigation
            </p>
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 hover:text-white transition-colors self-start"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Prestations */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">
              Prestations
            </p>
            {SERVICES.map((s) => (
              <a
                key={s}
                href="#prestations"
                className="text-sm text-white/70 hover:text-white transition-colors self-start"
              >
                {s}
              </a>
            ))}
          </div>

          {/* Contact + horaires */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">
              Contact
            </p>
            <div className="flex items-start gap-2.5 text-sm text-white/70">
              <MapPin size={15} className="text-[#FF5C35] mt-0.5 shrink-0" />
              <span>
                1 Rue du Cabaret de la Belle Femme
                <br />
                80090 Amiens, France
              </span>
            </div>
            <a
              href="tel:+33645893156"
              className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Phone size={15} className="text-[#FF5C35] shrink-0" />
              +33 6 45 89 31 56
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Navigation2 size={15} className="text-[#FF5C35] shrink-0" />
              Itinéraire
            </a>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm pt-2 border-t border-white/10">
              <span className="text-white/50">Lundi – Samedi</span>
              <span className="text-white/80">07:00 – 18:00</span>
              <span className="text-white/50">Dimanche</span>
              <span className="text-white/80">Fermé</span>
            </div>
          </div>
        </div>

        {/* Barre basse */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
          <span>
            © {new Date().getFullYear()} Renov Peintures — Tous droits réservés
          </span>
          <span>Peintre en bâtiment · Amiens (80)</span>
        </div>
      </div>
    </footer>
  )
}
