import type { LandingDict } from "../landing-content";
import { PRICING_SHARED } from "./pricing-shared";

export const es: LandingDict = {
  nav: { demo: "Demo", how: "Cómo funciona", pricing: "Precios", faq: "FAQ", login: "Iniciar sesión" },
  cta: "Prueba gratis 14 días",
  hero: {
    eyebrow: "Para restaurantes que reciben al mundo",
    titlePlain: "Un menú.",
    titleHighlight: "Todos los idiomas.",
    subtitle:
      "Sube una foto o el PDF de tu carta: en pocos minutos se convierte en una carta digital en 20 idiomas, con los alérgenos en regla. Los clientes extranjeros escanean un código QR y lo leen todo en su idioma, sin descargar ninguna app.",
    cta2: "Prueba la demo",
    trust: ["14 días gratis", "Sin app para los clientes", "Cancela cuando quieras"],
    imageAlt: "Cliente en la mesa escaneando el código QR de la carta con el móvil",
  },
  demo: {
    title: "Mira tu carta con los ojos de un turista",
    text: "Escanea el código QR o toca el botón: se abre la carta de una trattoria de ejemplo, tal como la verían tus clientes.",
    bullets: ["Cambia de idioma con un toque", "Filtra platos sin gluten, sin marisco o veganos"],
    namesBullet: "Mira cómo los nombres de los platos se quedan en el idioma original",
    button: "Abrir la carta de ejemplo",
    scan: "Escanéalo con el móvil",
  },
  benefits: {
    title: "Una carta que los clientes entienden es una carta en la que gastan más",
    items: [
      {
        title: "Ticket medio más alto",
        description: "Quien entiende lo que pide se atreve a más: entrantes, platos de la casa, vino.",
      },
      {
        title: "Alérgenos siempre en regla",
        description:
          "Los 14 alérgenos que exige el Reglamento (UE) 1169/2011 aparecen señalados y traducidos a cada idioma. El cliente filtra por sí mismo los platos que le convienen.",
      },
      {
        title: "Tu equipo trabaja mejor",
        description:
          "Se acabó explicar cada plato en un inglés improvisado. Las comandas van más rápido y las mesas rotan antes.",
      },
      {
        title: "Menos errores, mejores reseñas",
        description: "Quien sabe lo que ha pedido no se lleva sorpresas, y lo cuenta en Google y TripAdvisor.",
      },
    ],
  },
  how: {
    title: "De la carta en papel a la carta en 20 idiomas, en tres pasos",
    steps: [
      { title: "Sube una foto o un PDF", description: "La inteligencia artificial reconoce secciones, platos y precios." },
      {
        title: "Revisa y publica",
        description:
          "Corrige lo que quieras, añade fotos y descarga el código QR listo para imprimir para mesas, escaparate o tickets.",
      },
      { title: "El cliente elige su idioma", description: "Escanea el QR, elige uno de los 20 idiomas y lee la carta." },
    ],
    note: "Precios y platos del día se actualizan con un solo cambio, en todos los idiomas.",
  },
  names: {
    title: "El nombre de tus platos sigue siendo tuyo",
    text: "La carbonara sigue siendo carbonara. MENUO mantiene el nombre original y traduce la descripción, para que el cliente extranjero entienda lo que pide sin perder autenticidad. Cada traducción se puede editar.",
    original: "Cacio e pepe",
    translations: [
      { lang: "EN", text: "Tonnarelli with Pecorino Romano and black pepper" },
      { lang: "DE", text: "Tonnarelli mit Pecorino Romano und schwarzem Pfeffer" },
      { lang: "FR", text: "Tonnarelli au pecorino romano et poivre noir" },
    ],
  },
  languagesSection: { title: "20 idiomas, una sola carta", note: "Y más en camino." },
  social: { title: "Ya lo usan restaurantes como el tuyo" },
  pricing: {
    ...PRICING_SHARED.es,
    title: "Elige el plan que encaja con tu restaurante",
    subtitle:
      "Todos los planes incluyen 20 idiomas, código QR, exportación en PDF, los 14 alérgenos de la UE y la importación desde foto o PDF.",
    planDesc: {
      essential: "P. ej. tu carta principal",
      business: "P. ej. comida, cena y carta de vinos",
      hospitality: "P. ej. restaurante, bar, desayunos y room service",
      "multi-location": "Para grupos con varios locales",
    },
    anchor: "Menos que dos cafés a la semana",
    fiscal: "Precios sin IVA · Factura a nombre de tu empresa (NIF/CIF)",
    noCommitment: "Sin permanencia: cancela cuando quieras",
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Necesito tarjeta para la prueba?",
        a: "Sí, te la pedimos al empezar, pero durante 14 días no cobramos nada. Si cancelas antes de que termine la prueba, no pagas nada.",
      },
      {
        q: "¿Recibo factura?",
        a: "Sí. Añade el NIF/CIF de tu empresa al suscribirte y recibirás cada mes (o cada año) la factura a nombre de tu empresa.",
      },
      {
        q: "¿Las traducciones son correctas? ¿Puedo editarlas?",
        a: "Las traducciones se generan automáticamente y puedes corregir cada texto, en cada idioma. El nombre original de los platos no cambia.",
      },
      {
        q: "¿Mis clientes tienen que descargar una app?",
        a: "No. Escanean el código QR con la cámara y la carta se abre en el navegador.",
      },
      {
        q: "¿Cómo funcionan los alérgenos?",
        a: "Marcas los 14 alérgenos de la UE en cada plato y MENUO los muestra traducidos a cada idioma. El cliente puede filtrar los platos que le convienen. La responsabilidad de la información sigue siendo del restaurante.",
      },
      {
        q: "Si cambio un precio, ¿tengo que reimprimir el QR?",
        a: "No. El código QR es siempre el mismo y los cambios se publican en todos los idiomas.",
      },
      { q: "¿Qué cuenta como «menú»?", a: "Cada carta separada: por ejemplo comida, cena, carta de vinos o postres." },
      {
        q: "¿Puedo cancelar cuando quiera?",
        a: "Sí, sin permanencia. Cancela desde tu cuenta en cualquier momento y el plan sigue activo hasta el final del periodo pagado.",
      },
    ],
  },
  final: {
    title: "Dale a cada cliente tu carta completa, en su idioma",
    human: "¿Prefieres hablar con una persona? Te respondemos por WhatsApp.",
    humanEmail: "¿Prefieres hablar con una persona? Escríbenos:",
    whatsapp: "Escríbenos por WhatsApp",
  },
  footer: { tagline: "Un menú. Todos los idiomas.", cookies: "Cookies" },
};
