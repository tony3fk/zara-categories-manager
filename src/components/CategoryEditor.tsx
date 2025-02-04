import React from "react";
import styled from "styled-components";
import AddProduct from "./AddProduct";
import Row from "./Row";
import ZoomControls from "./ZoomControls";
import Logo from "./Logo";
import { useCategory } from "../context/CategoryContext";
import { useZoom } from "../hooks/useZoom";
import { Product } from "../types/category";

const EDITOR_WIDTH = 1000; // Mismo ancho que las filas
const SIDEBAR_WIDTH = 280; // Ancho del panel de productos

const Container = styled.div`
  padding: 20px;
  width: ${EDITOR_WIDTH + SIDEBAR_WIDTH}px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled.header`
  margin-bottom: 40px;
  text-align: center;
  padding-left: ${SIDEBAR_WIDTH}px; // Compensar el ancho del panel lateral
`;

const Title = styled.h1`
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 16px;
  font-weight: 300;
`;

const AddRowButton = styled.button`
  position: fixed;
  right: 20px;
  top: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #6c757d;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: #4a90e2;
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const EditorContainer = styled.div<{ scale: number }>`
  transform: scale(${(props) => props.scale});
  transform-origin: top center;
  transition: transform 0.2s ease;
  margin-left: ${SIDEBAR_WIDTH}px;
  width: ${EDITOR_WIDTH}px;
`;

const AddIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const CategoryEditor: React.FC = () => {
  const {
    rows,
    templates,
    addRow,
    addRowWithProduct,
    removeRow,
    moveRow,
    moveProduct,
    removeProduct,
    updateTemplate,
    addProduct,
  } = useCategory();

  const { scale, zoomIn, zoomOut, resetZoom } = useZoom();

  const handleAddProduct = (product: Product) => {
    if (rows.length === 0) {
      addRowWithProduct(product);
    } else {
      const lastRow = rows[rows.length - 1];
      if (lastRow.products.length < 3) {
        addProduct(lastRow.id, product);
      }
    }
  };

  return (
    <Container>
      <Logo />
      <AddRowButton onClick={addRow} title="Add new row">
        <AddIcon />
      </AddRowButton>
      <Header>
        <Title>Category Manager</Title>
      </Header>

      <AddProduct onAdd={handleAddProduct} />

      <EditorContainer scale={scale}>
        {rows.map((row, index) => (
          <Row
            key={row.id}
            row={row}
            index={index}
            templates={templates}
            onMoveProduct={moveProduct}
            onRemoveProduct={removeProduct}
            onUpdateTemplate={updateTemplate}
            onRemoveRow={removeRow}
            onMoveRow={moveRow}
          />
        ))}
      </EditorContainer>

      <ZoomControls
        scale={scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
      />
    </Container>
  );
};

export default CategoryEditor;
