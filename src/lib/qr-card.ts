const CARD_WIDTH = 1000;
const CARD_HEIGHT = 1400;
const NAVY = "#0b2d5b";
const AMBER = "#ffb020";

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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function displayFontFamily(): Promise<string> {
  if (typeof document === "undefined") return "sans-serif";
  const family = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-manrope")
    .trim();
  try {
    await document.fonts.ready;
  } catch {
    // fonts API not available/ready — canvas falls back to a system font
  }
  return family ? `${family}, sans-serif` : "sans-serif";
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

export async function drawQrCard(
  canvas: HTMLCanvasElement,
  { restaurantName, qrDataUrl }: { restaurantName: string; qrDataUrl: string }
): Promise<void> {
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const [qrImage, bubbleMark, wordmark, fontFamily] = await Promise.all([
    loadImage(qrDataUrl),
    loadImage(`data:image/svg+xml;base64,${btoa(BUBBLE_MARK_SVG)}`),
    loadImage(WORDMARK_SRC),
    displayFontFamily(),
  ]);

  const padding = 70;
  const maxTextWidth = CARD_WIDTH - padding * 2;

  // Background
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Restaurant name — shrinks to fit, wraps to a second line only if it
  // still doesn't fit at the smallest allowed size.
  const nameSize = fitFontSize(ctx, restaurantName, fontFamily, 700, 72, 40, maxTextWidth);
  ctx.font = `700 ${nameSize}px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  let nameBottomY = 190;
  if (ctx.measureText(restaurantName).width > maxTextWidth) {
    const words = restaurantName.split(" ");
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(" ");
    const line2 = words.slice(mid).join(" ");
    ctx.fillText(line1, CARD_WIDTH / 2, 150);
    ctx.fillText(line2, CARD_WIDTH / 2, 150 + nameSize + 10);
    nameBottomY = 150 + nameSize + 10;
  } else {
    ctx.fillText(restaurantName, CARD_WIDTH / 2, nameBottomY);
  }

  // Amber accent rule under the name
  ctx.strokeStyle = AMBER;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH / 2 - 50, nameBottomY + 36);
  ctx.lineTo(CARD_WIDTH / 2 + 50, nameBottomY + 36);
  ctx.stroke();

  // QR code, centered
  const qrSize = 620;
  const qrX = (CARD_WIDTH - qrSize) / 2;
  const qrY = 400;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  // Menuo mark over the QR center — its navy disc is opaque enough to sit
  // directly on the QR modules. QR was generated at error-correction level
  // H specifically so it stays scannable with this covered.
  const centerX = CARD_WIDTH / 2;
  const centerY = qrY + qrSize / 2;
  const markSize = 104;
  ctx.drawImage(bubbleMark, centerX - markSize / 2, centerY - markSize / 2, markSize, markSize);

  // Caption below the QR
  ctx.font = `600 34px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  const captionY = qrY + qrSize + 80;
  ctx.fillText("Scan for your menu", CARD_WIDTH / 2, captionY);
  ctx.fillText("in your language.", CARD_WIDTH / 2, captionY + 46);

  // "Powered by [Menuo wordmark]" signature at the bottom
  const poweredByText = "Powered by";
  ctx.font = `500 26px ${fontFamily}`;
  const poweredWidth = ctx.measureText(poweredByText).width;
  const wordmarkHeight = 34;
  const wordmarkWidth = wordmarkHeight * WORDMARK_ASPECT;
  const gap = 12;
  const groupWidth = poweredWidth + gap + wordmarkWidth;
  const groupStartX = CARD_WIDTH / 2 - groupWidth / 2;
  const signatureY = CARD_HEIGHT - 70;

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(poweredByText, groupStartX, signatureY);
  ctx.drawImage(
    wordmark,
    groupStartX + poweredWidth + gap,
    signatureY - wordmarkHeight + 6,
    wordmarkWidth,
    wordmarkHeight
  );
  ctx.textAlign = "center";
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
