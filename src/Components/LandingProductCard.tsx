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

const getOptimizedCloudinaryUrl = (url: string, width: number, height: number) => {
  if (!url) return "";
  const parts = url.split("/upload/");
  if (parts.length < 2) return url; // Not a standard Cloudinary URL

  // Extract cloud name and public ID with extension
  const cloudNameMatch = parts[0].match(/res\.cloudinary\.com\/(.*?)\//);
  const cloudName = cloudNameMatch ? cloudNameMatch[1] : "dqokryv6u"; // Fallback to a default if not found

  // Get everything after /upload/ (including version if present)
  const publicIdWithExtension = parts[1];

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,f_auto,q_auto/${publicIdWithExtension}`;
};

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
            <ProductImage
              src={getOptimizedCloudinaryUrl(image, 200, 200)}
              alt="product image"
              width={200}
              height={200}
              quality={70}
              sizes="(max-width: 600px) 40vw, 200px"
              loading="lazy"
            />
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
