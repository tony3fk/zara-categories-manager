import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Template } from "@/types/category";
import Row from "@/components/Row/Row";
import "jest-styled-components";

const mockRow = {
  id: "1",
  products: [
    {
      id: "1",
      name: "Test Product",
      price: 29.99,
      imageUrl: "test.jpg",
    },
  ],
  template: {
    id: "1",
    name: "Left",
    alignment: "left",
  } as Template,
  order: 0,
};

const mockTemplates = [
  { id: "1", name: "Left", alignment: "left" },
  { id: "2", name: "Center", alignment: "center" },
  { id: "3", name: "Right", alignment: "right" },
] as Template[];

const renderWithDnd = (component: React.ReactElement) => {
  return render(<DndProvider backend={HTML5Backend}>{component}</DndProvider>);
};

describe("Row Component", () => {
  const mockHandlers = {
    onSelect: jest.fn(),
    onMoveProduct: jest.fn(),
    onRemoveProduct: jest.fn(),
    onUpdateTemplate: jest.fn(),
    onRemoveRow: jest.fn(),
    onMoveRow: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with products", () => {
    renderWithDnd(
      <Row
        row={mockRow}
        index={0}
        templates={mockTemplates}
        isSelected={false}
        {...mockHandlers}
      />
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("29,99 €")).toBeInTheDocument();
  });

  it("handles selection correctly", () => {
    renderWithDnd(
      <Row
        row={mockRow}
        index={0}
        templates={mockTemplates}
        isSelected={false}
        {...mockHandlers}
      />
    );

    const container = screen.getByTestId("row-container");
    fireEvent.click(container);
    expect(mockHandlers.onSelect).toHaveBeenCalled();
  });

  it("disables alignment controls when appropriate", () => {
    const rowWithThreeProducts = {
      ...mockRow,
      products: [
        { id: "1", name: "Product 1", price: 29.99, imageUrl: "test1.jpg" },
        { id: "2", name: "Product 2", price: 29.99, imageUrl: "test2.jpg" },
        { id: "3", name: "Product 3", price: 29.99, imageUrl: "test3.jpg" },
      ],
    };

    renderWithDnd(
      <Row
        row={rowWithThreeProducts}
        index={0}
        templates={mockTemplates}
        isSelected={false}
        {...mockHandlers}
      />
    );

    const alignmentButtons = screen.getAllByTitle(/Alineación no disponible/i);
    alignmentButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("handles product removal", () => {
    renderWithDnd(
      <Row
        row={mockRow}
        index={0}
        templates={mockTemplates}
        isSelected={false}
        {...mockHandlers}
      />
    );

    const removeButton = screen.getByLabelText("Eliminar producto");
    fireEvent.click(removeButton);
    expect(mockHandlers.onRemoveProduct).toHaveBeenCalledWith(
      mockRow.id,
      mockRow.products[0].id
    );
  });

  it("handles row removal", () => {
    renderWithDnd(
      <Row
        row={mockRow}
        index={0}
        templates={mockTemplates}
        isSelected={false}
        {...mockHandlers}
      />
    );

    const removeRowButton = screen.getByTitle("Eliminar fila");
    fireEvent.click(removeRowButton);
    expect(mockHandlers.onRemoveRow).toHaveBeenCalledWith(mockRow.id);
  });

  it("applies correct styles when selected", () => {
    const { container } = renderWithDnd(
      <Row
        row={mockRow}
        index={0}
        templates={mockTemplates}
        isSelected={true}
        {...mockHandlers}
      />
    );

    const rowElement = container.firstChild;
    expect(rowElement).toHaveStyleRule("transform", "translateY(-4px)");
  });

  it("shows correct alignment based on template", () => {
    const rowWithCenterAlignment = {
      ...mockRow,
      template: { id: "2", name: "Center", alignment: "center" } as Template,
    };

    renderWithDnd(
      <Row
        row={rowWithCenterAlignment}
        index={0}
        templates={mockTemplates}
        isSelected={false}
        {...mockHandlers}
      />
    );

    const productsContainer = screen.getByTestId("products-container");
    expect(productsContainer).toHaveStyle({
      justifyContent: "center",
    });
  });
});
