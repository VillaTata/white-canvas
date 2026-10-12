import { MapPin, MessageCircle } from "lucide-react";

const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=4.9180313%2C-74.4213367";
const whatsappUrl = "https://wa.me/573213221252";

const ContactoSection = () => (
  <section
    id="contacto"
    aria-labelledby="contacto-heading"
    className="relative z-10 flex min-h-[65vh] flex-col justify-center bg-black/80 px-6 py-20 text-white md:px-20"
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
    </div>
  </section>
);

export default ContactoSection;
