import { createContext, useContext, useReducer, ReactNode } from "react";
import { CategoryRow, Product, Template } from "../types/category";

interface CategoryState {
  rows: CategoryRow[];
  templates: Template[];
}

type CategoryContextType = {
  rows: CategoryRow[];
  templates: Template[];
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
};

type CategoryAction =
  | { type: "ADD_ROW"; payload: { id: string } }
  | { type: "ADD_ROW_WITH_PRODUCT"; payload: { id: string; product: Product } }
  | { type: "REMOVE_ROW"; payload: { id: string } }
  | { type: "MOVE_ROW"; payload: { fromIndex: number; toIndex: number } }
  | { type: "ADD_PRODUCT"; payload: { rowId: string; product: Product } }
  | { type: "REMOVE_PRODUCT"; payload: { rowId: string; productId: string } }
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

    case "MOVE_PRODUCT": {
      const { fromRowId, toRowId, fromIndex, toIndex } = action.payload;
      const newRows = state.rows.map((row) => {
        if (row.id === fromRowId) {
          const newProducts = [...row.products];
          const [movedProduct] = newProducts.splice(fromIndex, 1);
          if (fromRowId === toRowId) {
            newProducts.splice(toIndex, 0, movedProduct);
          }
          return { ...row, products: newProducts };
        }
        if (row.id === toRowId && fromRowId !== toRowId) {
          const newProducts = [...row.products];
          const movedProduct = state.rows.find((r) => r.id === fromRowId)
            ?.products[fromIndex];
          if (movedProduct && newProducts.length < 3) {
            newProducts.splice(toIndex, 0, {
              ...movedProduct,
              id: crypto.randomUUID(),
            });
          }
          return { ...row, products: newProducts };
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

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  const value: CategoryContextType = {
    rows: state.rows,
    templates: state.templates,
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
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => useContext(CategoryContext);
