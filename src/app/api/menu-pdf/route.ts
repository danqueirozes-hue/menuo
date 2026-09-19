import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, requireMenuIdOwnership } from "@/lib/session";
import { isValidLanguage } from "@/lib/languages";
import { launchBrowser } from "@/lib/browser";

export async function GET(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const lang = url.searchParams.get("lang") ?? "";
  const menuId = url.searchParams.get("menuId") ?? "";
  if (!isValidLanguage(lang)) {
    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  }

  const owned = await requireMenuIdOwnership(menuId, userId);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const menu = await prisma.menu.findUnique({ where: { id: menuId }, select: { slug: true, isPublished: true } });
  if (!menu) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!menu.isPublished) {
    return NextResponse.json({ error: "Publish your menu before exporting a PDF." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const targetUrl = `${siteUrl}/m/${menu.slug}?lang=${lang}&print=1`;

  // Render the exact same public menu page guests see from the QR code, then
  // print it to PDF — this is what keeps the PDF a faithful copy instead of a
  // separately maintained layout that can drift from the real thing.
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage({ viewport: { width: 800, height: 1000 } });
    await page.goto(targetUrl, { waitUntil: "networkidle" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${menu.slug}-menu-${lang}.pdf"`,
      },
    });
  } finally {
    await browser.close();
  }
}
