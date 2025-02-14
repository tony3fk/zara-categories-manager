import ZoomControls from "@/components/ZoomControls/ZoomControls";
import { render, screen, fireEvent } from "@testing-library/react";

describe("ZoomControls Component", () => {
  const mockHandlers = {
    onZoomIn: jest.fn(),
    onZoomOut: jest.fn(),
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders zoom controls correctly", () => {
    render(
      <ZoomControls
        scale={1}
        onZoomIn={mockHandlers.onZoomIn}
        onZoomOut={mockHandlers.onZoomOut}
        onReset={mockHandlers.onReset}
      />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByLabelText("Reducir zoom")).toBeInTheDocument();
    expect(screen.getByLabelText("Aumentar zoom")).toBeInTheDocument();
    expect(screen.getByLabelText("Restablecer zoom")).toBeInTheDocument();
  });

  it("handles zoom in click", () => {
    render(
      <ZoomControls
        scale={1}
        onZoomIn={mockHandlers.onZoomIn}
        onZoomOut={mockHandlers.onZoomOut}
        onReset={mockHandlers.onReset}
      />
    );

    fireEvent.click(screen.getByLabelText("Aumentar zoom"));
    expect(mockHandlers.onZoomIn).toHaveBeenCalled();
  });

  it("handles zoom out click", () => {
    render(
      <ZoomControls
        scale={1}
        onZoomIn={mockHandlers.onZoomIn}
        onZoomOut={mockHandlers.onZoomOut}
        onReset={mockHandlers.onReset}
      />
    );

    fireEvent.click(screen.getByLabelText("Reducir zoom"));
    expect(mockHandlers.onZoomOut).toHaveBeenCalled();
  });

  it("handles reset click", () => {
    render(
      <ZoomControls
        scale={1.5}
        onZoomIn={mockHandlers.onZoomIn}
        onZoomOut={mockHandlers.onZoomOut}
        onReset={mockHandlers.onReset}
      />
    );

    fireEvent.click(screen.getByLabelText("Restablecer zoom"));
    expect(mockHandlers.onReset).toHaveBeenCalled();
  });

  it("displays correct scale percentage", () => {
    render(
      <ZoomControls
        scale={1.5}
        onZoomIn={mockHandlers.onZoomIn}
        onZoomOut={mockHandlers.onZoomOut}
        onReset={mockHandlers.onReset}
      />
    );

    expect(screen.getByText("150%")).toBeInTheDocument();
  });

  it("applies hover styles to buttons", () => {
    const { container } = render(
      <ZoomControls
        scale={1}
        onZoomIn={mockHandlers.onZoomIn}
        onZoomOut={mockHandlers.onZoomOut}
        onReset={mockHandlers.onReset}
      />
    );

    const buttons = container.querySelectorAll("button");
    buttons.forEach((button) => {
      fireEvent.mouseEnter(button);
      expect(button).toHaveStyle({
        background: "#dee2e6",
      });
    });
  });
});
