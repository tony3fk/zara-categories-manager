import React from "react";
import styled from "styled-components";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
  }

  &:active {
    background: #dee2e6;
  }
`;

const ScaleDisplay = styled.span`
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
`;

const ZoomControls: React.FC<ZoomControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
}) => {
  return (
    <Container>
      <Button onClick={onZoomOut} aria-label="Reducir zoom">
        -
      </Button>
      <ScaleDisplay>{Math.round(scale * 100)}%</ScaleDisplay>
      <Button onClick={onZoomIn} aria-label="Aumentar zoom">
        +
      </Button>
      <Button onClick={onReset} aria-label="Restablecer zoom">
        Reset
      </Button>
    </Container>
  );
};

export default ZoomControls;
