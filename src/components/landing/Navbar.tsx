import { Menu, X } from "lucide-react";
import { useState, type MouseEvent } from "react";

interface NavbarProps {
  visible: boolean;
}

const sectionLinks = [
  { href: "#finca", label: "La finca" },
  { href: "#galeria", label: "Galería" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#reservas", label: "Reservas" },
  { href: "#contacto", label: "Contacto" },
];

const scrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Navbar = ({ visible }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`
        fixed top-0 z-40 w-full bg-black/40 backdrop-blur-md
        transition-all duration-[1200ms]
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}
      `}
    >
      <nav className="relative flex items-center justify-between px-6 py-3 md:px-12">
        <a
          href="#top"
          onClick={(event) => {
            scrollToTop(event);
            closeMenu();
          }}
          className="group flex items-center gap-3 pl-14"
        >
          <span className="text-lg font-semibold tracking-wide text-white drop-shadow-md">
            Villa Tata
          </span>
        </a>

        <div className="hidden items-center gap-3 text-white sm:flex sm:gap-5 md:gap-8">
          {sectionLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-xs transition hover:text-green-300 sm:text-sm md:text-base"
            >
              {label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 sm:hidden"
        >
          {menuOpen ? (
            <X aria-hidden="true" className="h-6 w-6" />
          ) : (
            <Menu aria-hidden="true" className="h-6 w-6" />
          )}
        </button>

        <div
          id="mobile-navigation"
          className={`${menuOpen ? "flex" : "hidden"} absolute right-4 top-full z-50 min-w-48 flex-col rounded-lg border border-white/15 bg-black/95 p-2 text-white shadow-xl sm:hidden`}
        >
          {sectionLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="rounded-md px-4 py-3 text-sm transition hover:bg-white/10 hover:text-green-300"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
