import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProductCard from "@/components/ProductCard/ProductCard";

const mockProduct = {
  id: "1",
  name: "Test Product",
  price: 29.99,
  imageUrl: "test.jpg",
};

const renderWithDnd = (component: React.ReactElement) => {
  return render(<DndProvider backend={HTML5Backend}>{component}</DndProvider>);
};

describe("ProductCard Component", () => {
  const mockHandlers = {
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product information correctly", () => {
    renderWithDnd(
      <ProductCard
        product={mockProduct}
        rowId="row-1"
        index={0}
        onRemove={mockHandlers.onRemove}
      />
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("29,99 €")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "test.jpg");
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Test Product");
  });

  it("handles remove button click", () => {
    renderWithDnd(
      <ProductCard
        product={mockProduct}
        rowId="row-1"
        index={0}
        onRemove={mockHandlers.onRemove}
      />
    );

    const removeButton = screen.getByLabelText("Eliminar producto");
    fireEvent.click(removeButton);
    expect(mockHandlers.onRemove).toHaveBeenCalled();
  });

  it("shows drag indicator when dragging", () => {
    renderWithDnd(
      <ProductCard
        product={mockProduct}
        rowId="row-1"
        index={0}
        onRemove={mockHandlers.onRemove}
      />
    );

    const dragIndicator = screen.getByText("Arrastrando...");
    expect(dragIndicator).toBeInTheDocument();
    expect(dragIndicator).toHaveStyle({ opacity: "0" });
  });

  it("applies hover styles correctly", () => {
    const { container } = renderWithDnd(
      <ProductCard
        product={mockProduct}
        rowId="row-1"
        index={0}
        onRemove={mockHandlers.onRemove}
      />
    );

    const card = container.firstChild;
    fireEvent.mouseEnter(card as Element);
    expect(card).toHaveStyle({
      transform: "translateY(-2px)",
    });
  });
});
