/** One-off announcement (Nov 2026): the AI menu import, sent to the first
 * Italian signups. Copy written by the MENUO team. */

export const IMPORT_ANNOUNCEMENT_ID = "menu-import-2026-11";

/** Recipients and the first name used in the greeting. */
export const IMPORT_ANNOUNCEMENT_RECIPIENTS: { email: string; greeting: string }[] = [
  { email: "valdezniccolo303@gmail.com", greeting: "Niccolò" },
  { email: "giorgiacaoduro2507@gmail.com", greeting: "Giorgia" },
  { email: "mesolella.antonella15@gmail.com", greeting: "Antonella" },
];

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function buildImportAnnouncementEmail(greeting: string, siteUrl: string): { subject: string; html: string } {
  const p = 'style="color:#333;line-height:1.6;margin:0 0 16px;"';
  const login = `${siteUrl}/login`;
  const html = `
    <div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto;padding:8px;">
      <p ${p}>Buongiorno ${escapeHtml(greeting)},</p>
      <p ${p}>grazie per esserti registrato su MENUO.</p>
      <p ${p}>Abbiamo una novità che ti farà risparmiare molto tempo: ora puoi importare il tuo menu da un PDF o da una semplice foto del menu cartaceo. Non serve più inserire i piatti uno per uno. Basta caricare il file, controllare e pubblicare.</p>
      <p style="margin:24px 0;">
        <a href="${login}"><img src="${siteUrl}/email/menu-import-it.jpg" width="584" alt="Dalla foto del menu cartaceo al menu digitale MENUO"
          style="display:block;width:100%;max-width:584px;height:auto;border:0;border-radius:12px;"></a>
      </p>
      <p ${p}><strong>Come funziona:</strong></p>
      <ol style="color:#333;line-height:1.7;margin:0 0 16px;padding-left:20px;">
        <li>Accedi al tuo account su <a href="${login}" style="color:#0b2d5b;">menuoglobal.com/login</a></li>
        <li>Carica il PDF o scatta una foto del tuo menu</li>
        <li>Controlla piatti, prezzi e allergeni</li>
        <li>Genera il QR code e il tuo menu sarà disponibile in 20 lingue</li>
      </ol>
      <p style="margin:24px 0;">
        <a href="${login}" style="display:inline-block;background:#ffb020;color:#0b2d5b;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">Accedi a MENUO</a>
      </p>
      <p ${p}>Ci piacerebbe molto che lo provassi e ci dicessi cosa ne pensi. Ci vogliono pochi minuti e il tuo parere ci aiuta a migliorare MENUO per ristoranti come il tuo.</p>
      <p ${p}>Se preferisci, rispondi a questa email con il PDF o la foto del tuo menu e ti aiutiamo noi a configurarlo.</p>
      <p style="color:#333;line-height:1.6;margin:0;">Cordiali saluti,<br />Daniel Lobo<br />MENUO · Un menu. Tutte le lingue.<br />
        <a href="${siteUrl}" style="color:#0b2d5b;">menuoglobal.com</a></p>
    </div>`;
  return { subject: "Novità MENUO: il tuo menu online partendo da una foto", html };
}
