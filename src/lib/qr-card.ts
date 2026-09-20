const CARD_WIDTH = 1000;
const CARD_HEIGHT = 1400;
const NAVY = "#0b2d5b";
const AMBER = "#ffb020";

// Inlined src/app/icon.svg — the little navy/amber "menu lines" mark. Kept
// as a literal string so the card can be drawn in one pass with no extra
// network fetch (and no risk of a fetch failing/being slow mid-render).
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <rect width="40" height="40" rx="8" fill="#0B2D5B" />
  <circle cx="20" cy="20" r="13" fill="#FFB020" />
  <rect x="12.5" y="16.2" width="15" height="2.6" rx="1.3" fill="#FFFFFF" />
  <rect x="12.5" y="20.4" width="15" height="2.6" rx="1.3" fill="#FFFFFF" />
  <rect x="12.5" y="24.6" width="10" height="2.6" rx="1.3" fill="#FFFFFF" />
</svg>`;

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

  const [qrImage, iconImage, fontFamily] = await Promise.all([
    loadImage(qrDataUrl),
    loadImage(`data:image/svg+xml;base64,${btoa(ICON_SVG)}`),
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

  // Menuo mark over the QR center — QR was generated at error-correction
  // level H specifically so it stays scannable with this covered.
  const iconSize = 96;
  ctx.drawImage(
    iconImage,
    (CARD_WIDTH - iconSize) / 2,
    qrY + (qrSize - iconSize) / 2,
    iconSize,
    iconSize
  );

  // Caption below the QR
  ctx.font = `600 34px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  const captionY = qrY + qrSize + 80;
  ctx.fillText("Scan for your menu", CARD_WIDTH / 2, captionY);
  ctx.fillText("in your language.", CARD_WIDTH / 2, captionY + 46);

  // "Powered by [icon]" signature at the bottom
  const poweredByText = "Powered by";
  ctx.font = `500 26px ${fontFamily}`;
  const poweredWidth = ctx.measureText(poweredByText).width;
  const badgeSize = 34;
  const gap = 10;
  const groupWidth = poweredWidth + gap + badgeSize;
  const groupStartX = CARD_WIDTH / 2 - groupWidth / 2;
  const signatureY = CARD_HEIGHT - 70;

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(poweredByText, groupStartX, signatureY);
  ctx.drawImage(
    iconImage,
    groupStartX + poweredWidth + gap,
    signatureY - badgeSize + 6,
    badgeSize,
    badgeSize
  );
  ctx.textAlign = "center";
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
