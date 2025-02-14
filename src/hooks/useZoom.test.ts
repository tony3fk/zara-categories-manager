import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useZoom } from "./useZoom";

describe("useZoom Hook", () => {
  it("initializes with default values", () => {
    const { result } = renderHook(() => useZoom());

    expect(result.current.scale).toBe(1);
  });

  it("increases scale when zooming in", () => {
    const { result } = renderHook(() => useZoom());

    act(() => {
      result.current.zoomIn();
    });

    expect(result.current.scale).toBe(1.1);
  });

  it("decreases scale when zooming out", () => {
    const { result } = renderHook(() => useZoom());

    act(() => {
      result.current.zoomOut();
    });

    expect(result.current.scale).toBe(0.9);
  });

  it("resets scale to initial value", () => {
    const { result } = renderHook(() => useZoom());

    act(() => {
      result.current.zoomIn();
      result.current.zoomIn();
      result.current.resetZoom();
    });

    expect(result.current.scale).toBe(1);
  });

  it("respects min and max scale limits", () => {
    const { result } = renderHook(() =>
      useZoom({
        minScale: 0.5,
        maxScale: 1.5,
        step: 0.1,
      })
    );

    // Test max limit
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.zoomIn();
      });
    }
    expect(result.current.scale).toBe(1.5);

    // Test min limit
    for (let i = 0; i < 20; i++) {
      act(() => {
        result.current.zoomOut();
      });
    }
    expect(result.current.scale).toBe(0.5);
  });

  it("uses custom step value", () => {
    const { result } = renderHook(() =>
      useZoom({
        step: 0.2,
      })
    );

    act(() => {
      result.current.zoomIn();
    });

    expect(result.current.scale).toBe(1.2);
  });
});
