import { LANGUAGES } from "@/lib/languages";

const CARD_WIDTH = 1000;
const CARD_HEIGHT = 1400;
const NAVY = "#0b2d5b";
const AMBER = "#ffb020";
const TEAL = "#2f6f6a";

// The Menuo mark used over the QR center: a solid navy disc (its own
// backing, opaque enough to sit directly on the QR modules with no extra
// white plate) with the amber circle + white bars from the favicon inside.
// Kept as a literal string so the card can be drawn in one pass with no
// extra network fetch.
const BUBBLE_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#0B2D5B" />
  <circle cx="50" cy="50" r="32" fill="#FFB020" />
  <rect x="31" y="40" width="38" height="7" rx="3.5" fill="#FFFFFF" />
  <rect x="31" y="50" width="38" height="7" rx="3.5" fill="#FFFFFF" />
  <rect x="31" y="60" width="25" height="7" rx="3.5" fill="#FFFFFF" />
</svg>`;

const WORDMARK_SRC = "/brand/menuo-wordmark-negative.png";
const WORDMARK_ASPECT = 604 / 155;

// Three flags shown on the card as "Menu - 🇧🇷 🇬🇧 🇪🇸 +17 languages" —
// always the restaurant's own menu language first, then two widely spoken
// ones, so the "+17" always adds up to the real 20-language count.
const BADGE_CANDIDATE_CODES = ["en", "es", "fr", "it", "de", "pt"];

function pickBadgeLanguages(defaultLanguage: string): string[] {
  const rest = BADGE_CANDIDATE_CODES.filter((c) => c !== defaultLanguage);
  return [defaultLanguage, ...rest].slice(0, 3);
}

// Flag *emoji* are unreliable here: Windows in particular renders the
// regional-indicator sequence as plain letters ("GB") instead of an actual
// flag glyph, both directly in <canvas> text and when rasterized from an
// SVG <text> image — it's a font/OS limitation, not something fixable from
// CSS. Real flag SVGs (bundled from the "flag-icons" package into
// public/flags/, MIT licensed) render identically everywhere instead.
const FLAG_COUNTRY: Record<string, string> = {
  en: "gb",
  fr: "fr",
  de: "de",
  es: "es",
  it: "it",
  pt: "br",
  nl: "nl",
  pl: "pl",
  sv: "se",
  el: "gr",
  ru: "ru",
  tr: "tr",
  ar: "sa",
  zh: "cn",
  ja: "jp",
  ko: "kr",
  hi: "in",
  th: "th",
  vi: "vn",
  sw: "ke",
};

function flagImageSrc(languageCode: string): string {
  return `/flags/${FLAG_COUNTRY[languageCode] ?? "gb"}.svg`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function cssFontVar(name: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

async function loadFontFamilies(): Promise<{ body: string; serif: string }> {
  try {
    await document.fonts.ready;
  } catch {
    // fonts API not available/ready — canvas falls back to a system font
  }
  const body = cssFontVar("--font-manrope");
  const serif = cssFontVar("--font-playfair");
  return {
    body: body ? `${body}, sans-serif` : "sans-serif",
    serif: serif ? `${serif}, serif` : "serif",
  };
}

/** Shrinks font size until `text` fits within `maxWidth`, down to `min`. */
function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: number,
  start: number,
  min: number,
  maxWidth: number
): number {
  let size = start;
  while (size > min) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

/** Rounded-rect path helper (canvas has no built-in roundRect in all targets). */
function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Decorative corner accents matching the printed table-card mockup:
 * a thin amber arc top-left, and a teal wedge outlined in amber bottom-right. */
function drawCornerAccents(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = AMBER;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(18, 18, 92, 0, Math.PI / 2);
  ctx.stroke();

  const bx = CARD_WIDTH - 4;
  const by = CARD_HEIGHT - 4;
  ctx.beginPath();
  ctx.moveTo(bx - 170, by);
  ctx.arc(bx, by, 170, Math.PI, 1.5 * Math.PI, true);
  ctx.lineTo(bx, by - 170);
  ctx.closePath();
  ctx.fillStyle = TEAL;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(bx, by, 130, Math.PI, 1.5 * Math.PI, true);
  ctx.stroke();
  ctx.restore();
}

export async function drawQrCard(
  canvas: HTMLCanvasElement,
  {
    restaurantName,
    qrDataUrl,
    defaultLanguage = "en",
  }: { restaurantName: string; qrDataUrl: string; defaultLanguage?: string }
): Promise<void> {
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const badgeCodes = pickBadgeLanguages(defaultLanguage);
  const badges = badgeCodes
    .map((code) => LANGUAGES.find((l) => l.code === code))
    .filter((l): l is (typeof LANGUAGES)[number] => Boolean(l));

  const [qrImage, bubbleMark, wordmark, fonts, flagImages] = await Promise.all([
    loadImage(qrDataUrl),
    loadImage(`data:image/svg+xml;base64,${btoa(BUBBLE_MARK_SVG)}`),
    loadImage(WORDMARK_SRC),
    loadFontFamilies(),
    Promise.all(badges.map((l) => loadImage(flagImageSrc(l.code)))),
  ]);

  const padding = 90;
  const maxTextWidth = CARD_WIDTH - padding * 2;
  const centerX = CARD_WIDTH / 2;

  // Background + decorative corners
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  drawCornerAccents(ctx);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Restaurant name — elegant serif, shrinks to fit, wraps to a second line
  // only if it still doesn't fit at the smallest allowed size.
  const nameSize = fitFontSize(ctx, restaurantName, fonts.serif, 800, 80, 44, maxTextWidth);
  ctx.font = `800 ${nameSize}px ${fonts.serif}`;
  ctx.fillStyle = "#ffffff";
  let nameBottomY = 195;
  if (ctx.measureText(restaurantName).width > maxTextWidth) {
    const words = restaurantName.split(" ");
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(" ");
    const line2 = words.slice(mid).join(" ");
    ctx.fillText(line1, centerX, 155);
    ctx.fillText(line2, centerX, 155 + nameSize + 12);
    nameBottomY = 155 + nameSize + 12;
  } else {
    ctx.fillText(restaurantName, centerX, nameBottomY);
  }

  // Amber accent rule under the name
  ctx.strokeStyle = AMBER;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX - 50, nameBottomY + 34);
  ctx.lineTo(centerX + 50, nameBottomY + 34);
  ctx.stroke();

  // "Menu - [flags] +N languages" row
  const menuRowY = nameBottomY + 110;
  const moreCount = LANGUAGES.length - badges.length;

  ctx.font = `700 34px ${fonts.body}`;
  const menuLabel = "Menu -";
  const menuLabelWidth = ctx.measureText(menuLabel).width;

  ctx.font = `500 26px ${fonts.body}`;
  const moreLabel = `+${moreCount} languages`;
  const moreLabelWidth = ctx.measureText(moreLabel).width;

  const flagDiameter = 52;
  const flagGap = 10;
  const flagsWidth = badges.length * flagDiameter + (badges.length - 1) * flagGap;
  const groupGap = 18;
  const totalRowWidth = menuLabelWidth + groupGap + flagsWidth + groupGap + moreLabelWidth;

  let cursorX = centerX - totalRowWidth / 2;
  ctx.textAlign = "left";
  ctx.font = `700 34px ${fonts.body}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(menuLabel, cursorX, menuRowY + 12);
  cursorX += menuLabelWidth + groupGap;

  badges.forEach((_, i) => {
    const cx = cursorX + flagDiameter / 2;
    const cy = menuRowY - flagDiameter / 2 + 26;
    const radius = flagDiameter / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // The flag SVGs are square (full flag, not pre-cropped to a circle) —
    // clip to the same circle so it reads as a neat round badge.
    ctx.save();
    ctx.clip();
    ctx.drawImage(flagImages[i], cx - radius, cy - radius, flagDiameter, flagDiameter);
    ctx.restore();

    cursorX += flagDiameter + flagGap;
  });

  ctx.textAlign = "left";
  ctx.font = `500 26px ${fonts.body}`;
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText(moreLabel, cursorX + groupGap - flagGap, menuRowY + 10);
  ctx.textAlign = "center";

  // QR code on a rounded white tile, centered
  const tileSize = 580;
  const tileX = centerX - tileSize / 2;
  const tileY = menuRowY + 90;
  const qrPad = 26;
  const qrSize = tileSize - qrPad * 2;

  roundedRectPath(ctx, tileX, tileY, tileSize, tileSize, 20);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.drawImage(qrImage, tileX + qrPad, tileY + qrPad, qrSize, qrSize);

  // Menuo mark over the QR center — its navy disc is opaque enough to sit
  // directly on the QR modules. QR was generated at error-correction level
  // H specifically so it stays scannable with this covered.
  const qrCenterX = tileX + tileSize / 2;
  const qrCenterY = tileY + tileSize / 2;
  const markSize = 100;
  ctx.drawImage(bubbleMark, qrCenterX - markSize / 2, qrCenterY - markSize / 2, markSize, markSize);

  // Caption below the QR
  ctx.font = `600 32px ${fonts.body}`;
  ctx.fillStyle = "#ffffff";
  const captionY = tileY + tileSize + 66;
  ctx.fillText("Scan for your menu", centerX, captionY);
  ctx.fillText("in your language.", centerX, captionY + 42);

  // Menuo wordmark + domain, the card's main brand signature
  const wordmarkHeight = 64;
  const wordmarkWidth = wordmarkHeight * WORDMARK_ASPECT;
  const wordmarkY = captionY + 90;
  ctx.drawImage(wordmark, centerX - wordmarkWidth / 2, wordmarkY, wordmarkWidth, wordmarkHeight);

  ctx.font = `500 24px ${fonts.body}`;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("menuoglobal.com", centerX, wordmarkY + wordmarkHeight + 38);
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
