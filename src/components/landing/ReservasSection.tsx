const links = [
  {
    href: "https://wa.me/573213221252",
    icon: "💬",
    title: "WhatsApp",
    subtitle: "Reserva directa",
    className: "bg-green-600 hover:bg-green-700",
  },
  {
    href: "https://www.airbnb.com.co/rooms/1335775644190168406?search_mode=regular_search&adults=1&check_in=2026-03-15&check_out=2026-03-20&children=0&infants=0&pets=0&source_impression_id=p3_1773617165_P3zUTmvh246Ns2d0&previous_page_section_name=1000&federated_search_id=2493949c-7c6b-47f6-9f8a-7eab7ca1ffa3",
    icon: "🏡",
    title: "Airbnb",
    subtitle: "Ver disponibilidad",
    className: "bg-[#FF385C] hover:opacity-90",
  },
  {
    href: "https://www.booking.com/hotel/co/alquiler-de-cabana-completa-granja-autosostenible.es.html?aid=304142&label=gen173rf-10CAEoggI46AdIClgDaDKIAQGYATO4ARfIARXYAQPoAQH4AQGIAgGiAg5sb2NhbGhvc3Q6ODA4MKgCAbgC8f7czQbAAgHSAiQzOGMyZDUyMy1kMjdmLTQxMzQtYjAwYy0yNWQzMTM4Y2VmOWbYAgHgAgE&ucfs=1&arphpl=1",
    icon: "🛎️",
    title: "Booking",
    subtitle: "Reservar en Booking",
    className: "bg-[#003580] hover:bg-[#00224f]",
  },
];

const ReservasSection = () => (
  <section
    id="reservas"
    className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-white bg-black/80"
  >
    <div className="max-w-3xl text-center">
      <h2 className="landing-h2 mb-6">
        Reserva tu experiencia
        <span className="landing-h2-accent" />
      </h2>

      <p className="text-white/80 mb-12">
        Puedes reservar tu estadía en Villa Tata desde cualquiera de nuestras plataformas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center rounded-xl py-6 shadow-lg transition ${link.className}`}
          >
            <span className="text-2xl mb-2">{link.icon}</span>
            <span className="font-semibold text-lg">{link.title}</span>
            <span className="text-sm text-white/80">{link.subtitle}</span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default ReservasSection;
