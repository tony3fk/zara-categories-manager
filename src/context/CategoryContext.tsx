import { createContext, useContext, useReducer, ReactNode } from "react";
import { CategoryRow, Product, Template } from "@/types/category";

interface CategoryState {
  rows: CategoryRow[];
  templates: Template[];
  selectedRowId: string | null;
}

type CategoryContextType = {
  rows: CategoryRow[];
  templates: Template[];
  selectedRowId: string | null;
  addRow: () => string;
  addRowWithProduct: (product: Product) => string;
  removeRow: (id: string) => void;
  moveRow: (fromIndex: number, toIndex: number) => void;
  addProduct: (rowId: string, product: Product) => void;
  removeProduct: (rowId: string, productId: string) => void;
  moveProduct: (
    fromRowId: string,
    toRowId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  updateTemplate: (rowId: string, template: Template) => void;
  selectRow: (id: string | null) => void;
};

type CategoryAction =
  | { type: "ADD_ROW"; payload: { id: string } }
  | { type: "ADD_ROW_WITH_PRODUCT"; payload: { id: string; product: Product } }
  | { type: "REMOVE_ROW"; payload: { id: string } }
  | { type: "MOVE_ROW"; payload: { fromIndex: number; toIndex: number } }
  | { type: "ADD_PRODUCT"; payload: { rowId: string; product: Product } }
  | { type: "REMOVE_PRODUCT"; payload: { rowId: string; productId: string } }
  | { type: "SELECT_ROW"; payload: { id: string | null } }
  | {
      type: "MOVE_PRODUCT";
      payload: {
        fromRowId: string;
        toRowId: string;
        fromIndex: number;
        toIndex: number;
      };
    }
  | { type: "UPDATE_TEMPLATE"; payload: { rowId: string; template: Template } };

const defaultTemplates: Template[] = [
  { id: "1", name: "Left", alignment: "left" },
  { id: "2", name: "Center", alignment: "center" },
  { id: "3", name: "Right", alignment: "right" },
];

const initialState: CategoryState = {
  rows: [],
  templates: defaultTemplates,
  selectedRowId: null,
};

const CategoryContext = createContext<CategoryContextType>(null!);

function categoryReducer(
  state: CategoryState,
  action: CategoryAction
): CategoryState {
  switch (action.type) {
    case "ADD_ROW": {
      const newId = crypto.randomUUID();
      return {
        ...state,
        rows: [
          ...state.rows,
          {
            id: newId,
            products: [],
            template: defaultTemplates[0],
            order: state.rows.length,
          },
        ],
        selectedRowId: newId,
      };
    }

    case "ADD_ROW_WITH_PRODUCT": {
      const { id, product } = action.payload;
      return {
        ...state,
        rows: [
          ...state.rows,
          {
            id,
            products: [{ ...product, id: crypto.randomUUID() }],
            template: defaultTemplates[0],
            order: state.rows.length,
          },
        ],
        selectedRowId: id,
      };
    }

    case "REMOVE_ROW":
      return {
        ...state,
        rows: state.rows.filter((row) => row.id !== action.payload.id),
      };

    case "MOVE_ROW": {
      const { fromIndex, toIndex } = action.payload;
      const newRows = [...state.rows];
      const [movedRow] = newRows.splice(fromIndex, 1);
      newRows.splice(toIndex, 0, movedRow);
      return {
        ...state,
        rows: newRows,
      };
    }

    case "ADD_PRODUCT": {
      const { rowId, product } = action.payload;
      return {
        ...state,
        rows: state.rows.map((row) =>
          row.id === rowId && row.products.length < 3
            ? {
                ...row,
                products: [
                  ...row.products,
                  { ...product, id: crypto.randomUUID() },
                ],
              }
            : row
        ),
      };
    }

    case "REMOVE_PRODUCT": {
      const { rowId, productId } = action.payload;
      return {
        ...state,
        rows: state.rows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                products: row.products.filter((p) => p.id !== productId),
              }
            : row
        ),
      };
    }

    case "SELECT_ROW":
      return {
        ...state,
        selectedRowId: action.payload.id,
      };

    case "MOVE_PRODUCT": {
      const { fromRowId, toRowId, fromIndex, toIndex } = action.payload;
      const fromRow = state.rows.find((r) => r.id === fromRowId);
      const toRow = state.rows.find((r) => r.id === toRowId);

      if (!fromRow || !toRow) return state;

      const newRows = state.rows.map((row) => {
        if (row.id === fromRowId) {
          const newProducts = [...row.products];
          const [movedProduct] = newProducts.splice(fromIndex, 1);

          if (fromRowId === toRowId) {
            newProducts.splice(toIndex, 0, movedProduct);
          } else if (toRow.products.length === 3) {
            // Si la fila destino tiene 3 productos, intercambiamos
            const targetProduct = toRow.products[toIndex];
            newProducts.splice(fromIndex, 0, {
              ...targetProduct,
              id: crypto.randomUUID(),
            });
          }

          return { ...row, products: newProducts };
        }

        if (row.id === toRowId && fromRowId !== toRowId) {
          const newProducts = [...row.products];
          const movedProduct = fromRow.products[fromIndex];

          if (newProducts.length === 3) {
            // Si tenemos 3 productos, reemplazamos el producto en la posición objetivo
            newProducts.splice(toIndex, 1, {
              ...movedProduct,
              id: crypto.randomUUID(),
            });
            return { ...row, products: newProducts };
          } else if (newProducts.length < 3) {
            // Si tenemos menos de 3 productos, añadimos normalmente
            newProducts.splice(toIndex, 0, {
              ...movedProduct,
              id: crypto.randomUUID(),
            });
            return { ...row, products: newProducts };
          }
        }
        return row;
      });

      return { ...state, rows: newRows };
    }

    case "UPDATE_TEMPLATE": {
      const { rowId, template } = action.payload;
      return {
        ...state,
        rows: state.rows.map((row) =>
          row.id === rowId ? { ...row, template } : row
        ),
      };
    }

    default:
      return state;
  }
}

export function CategoryProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  const value: CategoryContextType = {
    rows: state.rows,
    templates: state.templates,
    selectedRowId: state.selectedRowId,
    addRow: () => {
      const newId = crypto.randomUUID();
      dispatch({ type: "ADD_ROW", payload: { id: newId } });
      return newId;
    },
    addRowWithProduct: (product: Product) => {
      const newId = crypto.randomUUID();
      dispatch({
        type: "ADD_ROW_WITH_PRODUCT",
        payload: { id: newId, product },
      });
      return newId;
    },
    removeRow: (id: string) =>
      dispatch({ type: "REMOVE_ROW", payload: { id } }),
    moveRow: (fromIndex: number, toIndex: number) =>
      dispatch({ type: "MOVE_ROW", payload: { fromIndex, toIndex } }),
    addProduct: (rowId: string, product: Product) =>
      dispatch({ type: "ADD_PRODUCT", payload: { rowId, product } }),
    removeProduct: (rowId: string, productId: string) =>
      dispatch({ type: "REMOVE_PRODUCT", payload: { rowId, productId } }),
    moveProduct: (
      fromRowId: string,
      toRowId: string,
      fromIndex: number,
      toIndex: number
    ) =>
      dispatch({
        type: "MOVE_PRODUCT",
        payload: { fromRowId, toRowId, fromIndex, toIndex },
      }),
    updateTemplate: (rowId: string, template: Template) =>
      dispatch({ type: "UPDATE_TEMPLATE", payload: { rowId, template } }),
    selectRow: (id: string | null) =>
      dispatch({ type: "SELECT_ROW", payload: { id } }),
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => useContext(CategoryContext);
