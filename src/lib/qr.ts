import QRCode from "qrcode";

export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 2,
    width: 640,
    // High error correction so the printable table card (see
    // src/lib/qr-card.ts) can overlay the Menuo mark on the QR's center
    // without breaking scannability.
    errorCorrectionLevel: "H",
    color: { dark: "#14120f", light: "#ffffffff" },
  });
}
