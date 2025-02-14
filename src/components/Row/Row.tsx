import React from "react";
import styled from "styled-components";
import { useDrop, useDrag } from "react-dnd";
import { CategoryRow, Template } from "@/types/category";
import ProductCard from "@/components/ProductCard/ProductCard";
import {
  CONTAINER_WIDTH,
  PRODUCT_GAP,
  PRODUCT_WIDTH,
} from "@/constants/constants";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  TrashIcon,
} from "@/assets/icons/icons";

interface RowProps {
  row: CategoryRow;
  index: number;
  templates: Template[];
  isSelected: boolean;
  onSelect: () => void;
  onMoveProduct: (
    fromRowId: string,
    toRowId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  onRemoveProduct: (rowId: string, productId: string) => void;
  onUpdateTemplate: (rowId: string, template: Template) => void;
  onRemoveRow: (id: string) => void;
  onMoveRow: (fromIndex: number, toIndex: number) => void;
}

const Container = styled.div<{
  alignment: string;
  isDragging: boolean;
  isSelected: boolean;
}>`
  margin: 20px 0;
  padding: 20px;
  background: white;
  border-radius: 12px;
  position: relative;
  opacity: ${(props) => (props.isDragging ? 0.9 : 1)};
  cursor: move;
  border: 2px solid transparent;
  box-shadow: ${(props) =>
    props.isSelected
      ? "0 15px 35px rgba(0, 0, 0, 0.2)"
      : props.isDragging
      ? "0 10px 20px rgba(0, 0, 0, 0.1)"
      : "0 10px 20px rgba(0, 0, 0, 0.1)"};
  transform: ${(props) =>
    props.isSelected ? "translateY(-4px)" : "translateY(0)"};
  transition: all 0.3s ease;
  width: ${CONTAINER_WIDTH}px;

  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .products-container {
    display: flex;
    gap: ${PRODUCT_GAP}px;
    height: 400px;
    min-height: 400px;
    justify-content: ${(props) => {
      switch (props.alignment) {
        case "left":
          return "flex-start";
        case "center":
          return "center";
        case "right":
          return "flex-end";
        default:
          return "flex-start";
      }
    }};
    position: relative;
    background: ${(props) =>
      props.isSelected ? "rgba(74, 144, 226, 0.02)" : "transparent"};
    border-radius: 8px;
    transition: background-color 0.3s ease;
  }
`;

const ProductWrapper = styled.div<{ width: number }>`
  width: ${(props) => props.width}px;
  position: relative;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const AlignmentControls = styled.div`
  display: flex;
  gap: 4px;
`;

const AlignmentButton = styled.button<{ isActive: boolean; disabled: boolean }>`
  padding: 8px;
  border: none;
  background: ${(props) => {
    if (props.disabled) return "#e9ecef";
    return props.isActive ? "#4a90e2" : "transparent";
  }};
  color: ${(props) => {
    if (props.disabled) return "#adb5bd";
    return props.isActive ? "white" : "#6c757d";
  }};
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &:hover {
    background: ${(props) => {
      if (props.disabled) return "#e9ecef";
      return props.isActive ? "#357abd" : "#e9ecef";
    }};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  color: #dc3545;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(220, 53, 69, 0.1);
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const DragHandle = styled.div`
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 40px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  align-items: center;
  cursor: move;
  opacity: 0.5;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  &::before,
  &::after {
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #6c757d;
    box-shadow: 0 8px 0 #6c757d, 0 16px 0 #6c757d;
  }
`;

const DropIndicator = styled.div<{ isVisible: boolean; left: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #4a90e2;
  left: ${(props) => props.left}px;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.2s ease;
  pointer-events: none;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: -3px;
    width: 10px;
    height: 10px;
    background: #4a90e2;
    border-radius: 50%;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }
`;

const Row: React.FC<RowProps> = ({
  row,
  index,
  templates,
  isSelected,
  onSelect,
  onMoveProduct,
  onRemoveProduct,
  onUpdateTemplate,
  onRemoveRow,
  onMoveRow,
}) => {
  const [, drop] = useDrop({
    accept: ["PRODUCT", "ROW"],
    drop: (item: {
      type: string;
      id: string;
      rowId?: string;
      index: number;
    }) => {
      if (item.type === "PRODUCT" && item.rowId !== row.id) {
        onMoveProduct(item.rowId!, row.id, item.index, row.products.length);
      } else if (item.type === "ROW" && item.index !== index) {
        onMoveRow(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    type: "ROW",
    item: { type: "ROW", id: row.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOverProduct, currentDropIndex }, productDrop] = useDrop({
    accept: "PRODUCT",
    hover: (
      item: { type: string; id: string; rowId: string; index: number },
      monitor
    ) => {
      if (!monitor.isOver({ shallow: true })) return;

      const hoverBoundingRect = document
        .getElementById(`product-container-${row.id}`)
        ?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      const dropIndex = Math.floor(
        hoverClientX / (PRODUCT_WIDTH + PRODUCT_GAP)
      );

      if (item.rowId === row.id && item.index === dropIndex) return;

      onMoveProduct(item.rowId, row.id, item.index, dropIndex);
      item.index = dropIndex;
      item.rowId = row.id;
    },
    collect: (monitor) => ({
      isOverProduct: monitor.isOver({ shallow: true }),
      currentDropIndex: monitor.isOver()
        ? Math.floor(
            (monitor.getClientOffset()?.x ?? 0) / (PRODUCT_WIDTH + PRODUCT_GAP)
          )
        : -1,
    }),
  });

  const shouldDisableAlignment =
    row.products.length === 0 || row.products.length === 3;

  return (
    <Container
      ref={(node) => drag(drop(node))}
      alignment={row.template.alignment}
      isDragging={isDragging}
      isSelected={isSelected}
      onClick={onSelect}
      data-testid="row-container"
    >
      <DragHandle />
      <Controls>
        <AlignmentControls>
          {templates.map((template) => (
            <AlignmentButton
              key={template.id}
              isActive={template.id === row.template.id}
              onClick={() =>
                !shouldDisableAlignment && onUpdateTemplate(row.id, template)
              }
              title={
                shouldDisableAlignment
                  ? "Alineación no disponible con 0 o 3 productos"
                  : template.name
              }
              disabled={shouldDisableAlignment}
            >
              {template.alignment === "left" && <AlignLeftIcon />}
              {template.alignment === "center" && <AlignCenterIcon />}
              {template.alignment === "right" && <AlignRightIcon />}
            </AlignmentButton>
          ))}
        </AlignmentControls>
        <RemoveButton onClick={() => onRemoveRow(row.id)} title="Eliminar fila">
          <TrashIcon />
        </RemoveButton>
      </Controls>
      <div
        className="products-container"
        ref={productDrop}
        id={`product-container-${row.id}`}
        data-testid="products-container"
      >
        {row.products.map((product, productIndex) => (
          <ProductWrapper key={product.id} width={PRODUCT_WIDTH}>
            <ProductCard
              product={product}
              rowId={row.id}
              index={productIndex}
              onRemove={() => onRemoveProduct(row.id, product.id)}
            />
          </ProductWrapper>
        ))}
        {isOverProduct && (
          <DropIndicator
            isVisible={true}
            left={
              currentDropIndex * (PRODUCT_WIDTH + PRODUCT_GAP) +
              (currentDropIndex === row.products.length ? PRODUCT_WIDTH : -2)
            }
          />
        )}
      </div>
    </Container>
  );
};

export default Row;
