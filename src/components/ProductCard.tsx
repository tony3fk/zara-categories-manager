import React from "react";
import styled from "styled-components";
import { useDrag } from "react-dnd";
import { Product } from "../types/category";

interface ProductCardProps {
  product: Product;
  rowId: string;
  index: number;
  onRemove: () => void;
}

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 280px;
  cursor: move;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 4px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Name = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease;
  font-size: 20px;
  color: #dc3545;
  z-index: 2;

  ${Card}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;

const DragIndicator = styled.div<{ isDragging: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  opacity: ${(props) => (props.isDragging ? 1 : 0)};
  transition: opacity 0.2s ease;
  z-index: 2;
`;

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  rowId,
  index,
  onRemove,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "PRODUCT",
    item: { type: "PRODUCT", id: product.id, rowId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Card
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <DragIndicator isDragging={isDragging}>Arrastrando...</DragIndicator>
      <RemoveButton onClick={onRemove} aria-label="Eliminar producto">
        ×
      </RemoveButton>
      <ImageContainer>
        <Image src={product.imageUrl} alt={product.name} />
      </ImageContainer>
      <Name>{product.name}</Name>
      <Price>
        {product.price.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
      </Price>
    </Card>
  );
};

export default ProductCard;
