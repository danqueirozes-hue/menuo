export type ClientItemVariant = {
  id: string;
  label: string;
  priceCents: number;
  position: number;
};

export type ClientItem = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  hasVariants: boolean;
  variants: ClientItemVariant[];
  photoUrl: string | null;
  position: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  hasSeafood: boolean;
  isSpecialty: boolean;
  isNew: boolean;
};

export type ClientSection = {
  id: string;
  name: string;
  position: number;
  items: ClientItem[];
};

export const SECTION_SUGGESTIONS = [
  "Starters",
  "First Course",
  "Main Course",
  "Dessert",
  "Beverages",
];
