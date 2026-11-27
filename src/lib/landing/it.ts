import type { LandingDict } from "../landing-content";
import { PRICING_SHARED } from "./pricing-shared";

export const it: LandingDict = {
  nav: { demo: "Demo", how: "Come funziona", pricing: "Prezzi", faq: "FAQ", login: "Accedi" },
  cta: "Prova gratis 14 giorni",
  hero: {
    eyebrow: "Per i ristoranti che accolgono il mondo",
    titlePlain: "Un menu.",
    titleHighlight: "Ogni lingua.",
    subtitle:
      "Carica il tuo menu in foto o PDF: in pochi minuti diventa un menu digitale in 20 lingue, con gli allergeni in regola. I clienti stranieri inquadrano un QR code e leggono tutto nella loro lingua, senza scaricare nessuna app.",
    cta2: "Prova la demo",
    trust: ["14 giorni gratis", "Nessuna app per i clienti", "Disdici quando vuoi"],
    imageAlt: "Segnaposto MENUO con QR code sul tavolo di un ristorante nella campagna toscana",
  },
  demo: {
    title: "Guarda il menu con gli occhi di un turista",
    text: "Inquadra il QR code o tocca il pulsante: si apre il menu di una trattoria di esempio, proprio come lo vedrebbero i tuoi clienti.",
    bullets: ["Cambia lingua con un tocco", "Filtra i piatti senza glutine, senza crostacei o vegani"],
    namesBullet: "Guarda come i nomi dei piatti restano in italiano",
    button: "Apri il menu di esempio",
    scan: "Inquadra con il telefono",
  },
  benefits: {
    title: "Un menu che i clienti capiscono è un menu su cui spendono di più",
    items: [
      {
        title: "Scontrino medio più alto",
        description: "Chi capisce cosa sta ordinando osa di più: antipasti, piatti della casa, vino.",
      },
      {
        title: "Allergeni sempre in regola",
        description:
          "I 14 allergeni previsti dal Reg. UE 1169/2011 sono segnalati e tradotti in ogni lingua. Il cliente filtra da solo i piatti adatti a lui.",
      },
      {
        title: "Il personale lavora meglio",
        description:
          "Basta spiegare ogni piatto in un inglese improvvisato. Le comande sono più veloci e i tavoli girano prima.",
      },
      {
        title: "Meno errori, recensioni migliori",
        description: "Chi sa cosa ha ordinato non ha sorprese, e lo racconta su Google e TripAdvisor.",
      },
    ],
  },
  how: {
    title: "Dal menu di carta al menu in 20 lingue, in tre passaggi",
    steps: [
      { title: "Carica una foto o un PDF", description: "L'intelligenza artificiale riconosce sezioni, piatti e prezzi." },
      {
        title: "Controlla e pubblica",
        description:
          "Correggi ciò che vuoi, aggiungi le foto e scarica il QR code pronto da stampare per tavoli, vetrina o scontrini.",
      },
      { title: "Il cliente sceglie la lingua", description: "Inquadra il QR, sceglie una delle 20 lingue e legge il menu." },
    ],
    note: "Prezzi e piatti del giorno si aggiornano con una sola modifica, in tutte le lingue.",
  },
  names: {
    title: "Il nome dei tuoi piatti resta il tuo",
    imageAlt: "Un piatto di cacio e pepe su un tovagliolo blu",
    text: "La carbonara resta carbonara. MENUO mantiene il nome originale e traduce la descrizione, così il cliente straniero capisce cosa ordina senza perdere l'autenticità. Ogni traduzione si può modificare.",
    original: "Cacio e pepe",
    translations: [
      { lang: "EN", text: "Tonnarelli with Pecorino Romano and black pepper" },
      { lang: "DE", text: "Tonnarelli mit Pecorino Romano und schwarzem Pfeffer" },
      { lang: "FR", text: "Tonnarelli au pecorino romano et poivre noir" },
    ],
  },
  languagesSection: { title: "20 lingue, un solo menu", note: "E altre in arrivo." },
  social: { title: "Lo usano già ristoranti come il tuo" },
  pricing: {
    ...PRICING_SHARED.it,
    title: "Scegli il piano adatto al tuo ristorante",
    subtitle:
      "Tutti i piani includono 20 lingue, QR code, esportazione PDF, i 14 allergeni UE e l'importazione da foto o PDF.",
    planDesc: {
      essential: "Ad es. il menu principale",
      business: "Ad es. pranzo, cena e carta dei vini",
      hospitality: "Ad es. ristorante, bar, colazione e room service",
      "multi-location": "Per gruppi con più sedi",
    },
    anchor: "Meno di due caffè a settimana",
    fiscal: "Prezzi IVA esclusa · Fattura intestata alla tua Partita IVA",
    noCommitment: "Nessun vincolo: disdici quando vuoi",
    securePayment: "Pagamento sicuro con Stripe",
    noChargeTrial: "Nessun addebito per 14 giorni",
  },
  faq: {
    title: "Domande frequenti",
    items: [
      {
        q: "Serve la carta di credito per la prova?",
        a: "Sì, la chiediamo all'attivazione, ma per 14 giorni non addebitiamo nulla. Se disdici prima della fine della prova, non paghi niente.",
      },
      {
        q: "Ricevo la fattura?",
        a: "Sì. Inserisci la Partita IVA al momento dell'abbonamento e ricevi ogni mese (o ogni anno) la fattura intestata alla tua attività, in regime di inversione contabile (reverse charge).",
      },
      {
        q: "Le traduzioni sono corrette? Posso modificarle?",
        a: "Le traduzioni sono generate automaticamente e puoi correggere ogni testo, in ogni lingua. Il nome originale dei piatti resta invariato.",
      },
      {
        q: "I miei clienti devono scaricare un'app?",
        a: "No. Inquadrano il QR code con la fotocamera e il menu si apre nel browser.",
      },
      {
        q: "Come funzionano gli allergeni?",
        a: "Indichi i 14 allergeni UE per ogni piatto e MENUO li mostra tradotti in ogni lingua. Il cliente può filtrare i piatti adatti a lui. La responsabilità delle informazioni resta del ristorante.",
      },
      {
        q: "Se cambio un prezzo devo ristampare il QR?",
        a: "No. Il QR code resta sempre lo stesso e le modifiche vanno online in tutte le lingue.",
      },
      { q: "Cosa conta come “menu”?", a: "Ogni carta separata: ad esempio pranzo, cena, carta dei vini o menù dei dolci." },
      {
        q: "Posso disdire quando voglio?",
        a: "Sì, nessun vincolo. Disdici dal tuo account in qualsiasi momento e il piano resta attivo fino alla fine del periodo pagato.",
      },
    ],
  },
  final: {
    title: "Dai a ogni cliente il tuo menu, nella sua lingua",
    human: "Preferisci parlarne con una persona? Ti rispondiamo su WhatsApp.",
    humanEmail: "Preferisci parlarne con una persona? Scrivici:",
    whatsapp: "Scrivici su WhatsApp",
  },
  footer: { tagline: "Un menu. Ogni lingua.", cookies: "Cookie" },
  chat: { cta: "Parla con noi ora", label: "Chat dal vivo" },
};
