import React, { useState } from "react";
import styled from "styled-components";
import { Product } from "@/types/category";
import { mockProducts } from "@/utils/mockData";

interface AddProductProps {
  onAdd: (product: Product) => void;
}

const Container = styled.div`
  position: fixed;
  top: 140px;
  left: 20px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 250px;
  max-height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0 0 16px;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 300;
`;

const ProductList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 0 -16px;
  padding: 0 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
  color: #2c3e50;
`;

const ProductPrice = styled.div`
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
`;

const AddProduct: React.FC<AddProductProps> = ({ onAdd }) => {
  const [products] = useState<Product[]>(mockProducts);

  return (
    <Container>
      <Title>Add Product</Title>
      <ProductList>
        {products.map((product) => (
          <ProductItem key={product.id} onClick={() => onAdd(product)}>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>
                {product.price.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </ProductPrice>
            </ProductInfo>
          </ProductItem>
        ))}
      </ProductList>
    </Container>
  );
};

export default AddProduct;
