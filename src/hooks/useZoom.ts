import { useState, useCallback } from "react";
import { ZoomConfig } from "../types/category";

const DEFAULT_CONFIG: ZoomConfig = {
  scale: 1,
  minScale: 0.5,
  maxScale: 2,
  step: 0.1,
};

export function useZoom(initialConfig?: Partial<ZoomConfig>) {
  const config = { ...DEFAULT_CONFIG, ...initialConfig };
  const [scale, setScale] = useState(config.scale);

  const zoomIn = useCallback(() => {
    setScale((currentScale) =>
      Math.min(config.maxScale, currentScale + config.step)
    );
  }, [config.maxScale, config.step]);

  const zoomOut = useCallback(() => {
    setScale((currentScale) =>
      Math.max(config.minScale, currentScale - config.step)
    );
  }, [config.minScale, config.step]);

  const resetZoom = useCallback(() => {
    setScale(config.scale);
  }, [config.scale]);

  return {
    scale,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
