import {
  ProductItem,
  ProductItemStyled,
  ProductImage,
  IconsContainer,
  IconWrapper,
  RatingContainer,
} from "@/StyledComponents/Products";
import {
  ProductPrice,
  ProductTitle,
  ReviewText,
} from "@/StyledComponents/Typos";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Box } from "@mui/material";

function LandingProductCard({ image }) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <>
      <ProductItem item md={2.4} xs={6}>
        <ProductItemStyled
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{ border: "none" }}
        >
          <Box
            sx={{
              width: "100%",
              height: "200px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <ProductImage src={image} alt="product image"/>
          </Box>
          {isHovered && (
            <IconsContainer>
              {/* Render your icons here */}
              <IconWrapper>
                <ShoppingBasketIcon sx={{ fontSize: "25px" }} />
              </IconWrapper>
              <IconWrapper>
                <ShoppingBasketIcon sx={{ fontSize: "25px" }} />
              </IconWrapper>
              <IconWrapper>
                <StarIcon sx={{ fontSize: "25px" }} />
              </IconWrapper>
            </IconsContainer>
          )}
          <br />
          <ProductPrice>$299.00</ProductPrice>
          <ProductTitle>Men Black Silk</ProductTitle>
          <RatingContainer>
            <StarIcon sx={{ fontSize: "14px", color: "rgb(78, 116, 96)" }} />
            <StarIcon sx={{ fontSize: "14px", color: "rgb(78, 116, 96)" }} />
            <StarIcon sx={{ fontSize: "14px", color: "rgb(78, 116, 96)" }} />
            <StarIcon sx={{ fontSize: "14px", color: "rgb(78, 116, 96)" }} />
            <StarIcon sx={{ fontSize: "14px", color: "rgb(78, 116, 96)" }} />
            <ReviewText>507 reviews</ReviewText>
          </RatingContainer>
        </ProductItemStyled>
      </ProductItem>
    </>
  );
}

export default LandingProductCard;
