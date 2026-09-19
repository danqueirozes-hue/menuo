import QRCode from "qrcode";

export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 2,
    width: 640,
    color: { dark: "#14120f", light: "#ffffffff" },
  });
}
