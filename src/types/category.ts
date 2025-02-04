export type Alignment = "left" | "center" | "right";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Template {
  id: string;
  name: string;
  alignment: Alignment;
}

export interface CategoryRow {
  id: string;
  products: Product[];
  template: Template;
  order: number;
}

export interface DragItem {
  type: "PRODUCT" | "ROW";
  id: string;
  index: number;
  rowId?: string;
}

export interface ZoomConfig {
  scale: number;
  minScale: number;
  maxScale: number;
  step: number;
}
