import "@testing-library/jest-dom";
import "jest-styled-components";
import { ReactNode } from "react";

// Mock para window.crypto.randomUUID
Object.defineProperty(window, "crypto", {
  value: {
    randomUUID: () => "test-uuid",
  },
});

// Mock para react-dnd
jest.mock("react-dnd", () => ({
  DndProvider: ({ children }: { children: ReactNode }) => children,
  useDrag: () => [{ isDragging: false }, () => {}],
  useDrop: () => [{}, () => {}],
}));

jest.mock("react-dnd-html5-backend", () => ({
  HTML5Backend: {},
}));
