import { z } from "zod";
import { ALLERGEN_KEYS } from "./allergens";

// Shared by the Next.js routes and netlify/functions/menu-import-background
// (which bundles this file directly), so: relative imports only, no "@/".

/** Imports per account (admins are unlimited). */
export const MENU_IMPORT_LIMIT = 3;
/** Netlify caps function request bodies at ~6 MB; photos are downscaled
 * client-side, so this mostly bounds PDFs. */
export const MENU_IMPORT_MAX_BYTES = 5 * 1024 * 1024;
export const MENU_IMPORT_MAX_FILES = 4;
export const MENU_IMPORT_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;
export const MENU_IMPORT_STORE = "menu-imports";

export const importedMenuSchema = z.object({
  sections: z.array(
    z.object({
      name: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          price: z.number(),
          variants: z.array(z.object({ label: z.string(), price: z.number() })),
          allergens: z.array(z.enum(ALLERGEN_KEYS)),
        })
      ),
    })
  ),
});
export type ImportedMenu = z.infer<typeof importedMenuSchema>;

/** Same shape as importedMenuSchema, as the JSON schema the model is held to. */
export const IMPORTED_MENU_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["sections"],
  properties: {
    sections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "items"],
        properties: {
          name: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["name", "description", "price", "variants", "allergens"],
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                price: { type: "number" },
                variants: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["label", "price"],
                    properties: { label: { type: "string" }, price: { type: "number" } },
                  },
                },
                allergens: { type: "array", items: { type: "string", enum: [...ALLERGEN_KEYS] } },
              },
            },
          },
        },
      },
    },
  },
} as const;

export const MENU_IMPORT_SYSTEM_PROMPT = `You turn a restaurant's existing menu (a PDF or photos of the printed menu) into structured data for a digital menu. The restaurant reviews your draft before anything is published, so be faithful rather than creative.

- Keep every name and description exactly in the menu's own language and wording. Do not translate, correct or embellish.
- Keep sections and dishes in the order they appear. Use the menu's own section headings; if dishes have no heading, group them under one sensible section name in the menu's language.
- description: the ingredients or description printed for the dish, or "" if there is none.
- price: the dish price as a plain number in the menu's currency (e.g. 12.5 for "12,50 €"). Use 0 when no price is printed.
- variants: only when one dish has several prices (sizes, formats, half/full portions, glass/bottle). Each variant gets the label printed for it and its price; then set price to the lowest variant price. Otherwise variants is [].
- allergens: only allergens the menu itself declares for that dish (allergen numbers, icons or a legend). Map them to the EU allergen keys. Never infer allergens from ingredients; when the menu declares none, use [].
- Skip everything that is not a dish: restaurant name, address, opening hours, service charge notes, decorative text.
- If the files contain no readable menu, return {"sections": []}.`;

export type MenuImportJob = {
  status: "pending" | "done" | "error" | "applied";
  userId: string;
  menuId: string;
  fileCount: number;
  createdAt: string;
  error?: "unreadable" | "too_long" | "failed";
  result?: ImportedMenu;
};
