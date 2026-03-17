import villaLogo from "@/assets/villa-tata-logo.jpeg";

interface NavbarProps {
  visible: boolean;
}

const scrollToTop = (e: React.MouseEvent) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Navbar = ({ visible }: NavbarProps) => (
  <header
    className={`
      fixed top-0 w-full z-40
      bg-black/40 backdrop-blur-md
      transition-all duration-[1200ms]
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
    `}
  >
    <nav className="flex items-center justify-between px-6 md:px-12 py-3">
      {/* Logo + Name */}
      <a
        href="#top"
        onClick={scrollToTop}
        className="flex items-center gap-3 group"
      >
        <img
          src={villaLogo}
          alt="Villa Tata"
          className="w-11 rounded-lg shadow-lg transition-transform group-hover:scale-105"
        />
        <span className="text-white font-semibold text-lg tracking-wide drop-shadow-md">
          Villa Tata
        </span>
      </a>

      {/* Links */}
      <div className="flex items-center gap-8 text-white">
        <a href="#finca" className="hover:text-green-300 transition text-sm md:text-base">
          La finca
        </a>
        <a href="#galeria" className="hover:text-green-300 transition text-sm md:text-base">
          Galería
        </a>
        <a href="#reservas" className="hover:text-green-300 transition text-sm md:text-base">
          Reservas
        </a>
      </div>
    </nav>
  </header>
);

export default Navbar;
