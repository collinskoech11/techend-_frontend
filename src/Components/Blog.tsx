import {
  ProductItem,
  ProductItemStyled,
  ProductImage,
  ProductsContainer,
} from "@/StyledComponents/Products";
import {
  ProductPrice,
  ProductTitle,
} from "@/StyledComponents/Typos";
import React from "react";

const products = [
  {
    imageUrl: "https://res.cloudinary.com/dqokryv6u/image/upload/v1721152227/dap2dqll2u5i64qee7z3.jpg",
    price: "$299.00",
    title: "Men Cream Silk",
  },
  {
    imageUrl: "https://res.cloudinary.com/dqokryv6u/image/upload/v1721424164/xw10hbelnmbvxrw8uakc.jpg",
    price: "$24.00",
    title: "Cotton socks (set of 5)",
  },
  {
    imageUrl: "https://res.cloudinary.com/dqokryv6u/image/upload/v1721424522/dgidvnqtaoyyiewtkwn4.jpg",
    price: "$19.00",
    title: "Cotton docks (set of 3)",
  },
];

function Blog() {
  return (
    <>
      <ProductsContainer container sx={{ margin: "auto", mt: 5 }}>
        {products.map((product, index) => (
          <ProductItem item md={4} xs={12} key={index}>
            <ProductItemStyled sx={{ border: "none" }}>
              <ProductImage src={product.imageUrl} />
              <ProductPrice sx={{ mt: 2 }}>{product.price}</ProductPrice>
              <ProductTitle sx={{ mt: 2 }}>{product.title}</ProductTitle>
            </ProductItemStyled>
          </ProductItem>
        ))}
      </ProductsContainer>
    </>
  );
}

export default Blog;
