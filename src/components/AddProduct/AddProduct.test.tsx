import { render, screen } from "@testing-library/react";
import { mockProducts } from "@/utils/mockData";
import AddProduct from "@/components/AddProduct/AddProduct";
import "jest-styled-components";

jest.mock("@/utils/mockData", () => ({
  mockProducts: [
    {
      id: "1",
      name: "Test Product",
      price: 29.99,
      imageUrl: "test.jpg",
    },
  ],
}));

describe("AddProduct Component", () => {
  const mockHandlers = {
    onAdd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product list correctly", () => {
    render(<AddProduct onAdd={mockHandlers.onAdd} />);

    expect(screen.getByText("Add Product")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("29,99 €")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "test.jpg");
  });

  it("handles product selection", () => {
    render(<AddProduct onAdd={mockHandlers.onAdd} />);

    const productItem = screen.getByText("Test Product").closest("div");
    productItem?.click();

    expect(mockHandlers.onAdd).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("applies hover styles to product items", () => {
    const { container } = render(<AddProduct onAdd={mockHandlers.onAdd} />);
    const productItem = container.querySelector(
      'div[data-testid="product-item"]'
    );

    expect(productItem).toHaveStyleRule("background", "#f8f9fa", {
      modifier: ":hover",
    });
    expect(productItem).toHaveStyleRule("transform", "translateY(-1px)", {
      modifier: ":hover",
    });
  });

  it("shows scrollbar when product list is long", () => {
    const { container } = render(<AddProduct onAdd={mockHandlers.onAdd} />);
    const productList = container.querySelector(".product-list");

    expect(productList).toBeInTheDocument();
    expect(productList).toHaveStyleRule("overflow-y", "auto");
  });
});
