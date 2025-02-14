import Logo from "@/components/Logo/Logo";
import { render } from "@testing-library/react";

describe("Logo Component", () => {
  it("renders correctly", () => {
    const { container } = render(<Logo />);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has correct styles", () => {
    const { container } = render(<Logo />);
    const logoContainer = container.firstChild;

    expect(logoContainer).toHaveStyle({
      position: "fixed",
      top: "20px",
      left: "20px",
      width: "250px",
      background: "white",
      padding: "16px",
      borderRadius: "8px",
      zIndex: "10",
    });
  });

  it("has correct SVG dimensions", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveStyle({
      width: "120px",
    });
  });

  it("has correct fill color", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveStyle({
      fill: "#2c3e50",
    });
  });
});
