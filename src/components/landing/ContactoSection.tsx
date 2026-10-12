import { MapPin, MessageCircle } from "lucide-react";

const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=4.9180313%2C-74.4213367";
const whatsappUrl = "https://wa.me/573213221252";

const socialLinks = [
  {
    href: "https://www.facebook.com/Fincavillatata",
    label: "Facebook",
    account: "Finca Villa Tata",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M13.5 21v-8.2h2.75l.41-3.2H13.5V7.56c0-.93.26-1.56 1.6-1.56h1.7V3.14c-.3-.04-1.34-.14-2.55-.14-2.52 0-4.25 1.54-4.25 4.37V9.6H7.15v3.2H10V21h3.5Z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/villatata8/",
    label: "Instagram",
    account: "@villatata8",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const ContactoSection = () => (
  <section
    id="contacto"
    aria-labelledby="contacto-heading"
    className="relative z-10 flex min-h-screen flex-col justify-center bg-black/80 px-6 py-20 text-white md:px-20"
  >
    <div className="mx-auto w-full max-w-5xl">
      <h2 id="contacto-heading" className="landing-h2 mb-6">
        Contacto y ubicación
        <span className="landing-h2-accent" />
      </h2>
      <p className="mb-10 text-center text-lg text-white/80">
        Visítanos en San Bernardo, Sasaima, Cundinamarca, Colombia.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-sm">
          <MapPin
            aria-hidden="true"
            className="mx-auto mb-4 h-8 w-8 text-green-300"
          />
          <h3 className="mb-3 text-xl font-semibold">Cómo llegar</h3>
          <address className="mb-6 not-italic leading-relaxed text-white/80">
            San Bernardo
            <br />
            Sasaima, Cundinamarca
            <br />
            Colombia
          </address>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 py-3 font-semibold transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
          >
            Ver ubicación en Google Maps
          </a>
        </article>

        <article className="rounded-xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-sm">
          <MessageCircle
            aria-hidden="true"
            className="mx-auto mb-4 h-8 w-8 text-green-300"
          />
          <h3 className="mb-3 text-xl font-semibold">Hablemos</h3>
          <p className="mb-2 text-white/80">WhatsApp para consultas y reservas</p>
          <p className="mb-6 text-lg font-semibold">+57 321 322 1252</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
          >
            Escríbenos por WhatsApp
          </a>
        </article>
      </div>

      <div className="mt-10 text-center">
        <h3 className="mb-4 text-lg font-semibold">Síguenos en redes sociales</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map(({ href, label, account, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label}: ${account}`}
              className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-white/90 transition hover:border-green-300/60 hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
            >
              <span className="text-green-300">{icon}</span>
              <span className="font-semibold">{label}</span>
              <span className="text-sm text-white/70">{account}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ContactoSection;
