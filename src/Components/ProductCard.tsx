'use client';

import React, { memo } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { Box, Typography, CircularProgress, IconButton, useTheme } from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import {
  ProductItemStyled,
  ProductImage,
  ProductImageWrapper,
  ProductInfoContainer,
  RatingContainer,
  IconActionsContainer,
} from "@/StyledComponents/Products";
import { ProductPrice, ProductTitle, ProductDescription } from "@/StyledComponents/Typos";
import { useAddToCartMutation, useAddToCartGuestMutation } from "@/Api/services";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/Types";

interface ProductCardProps {
  product: Product;
  triggerCartRefetch: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, triggerCartRefetch }) => {
  const router = useRouter();
  const theme = useTheme();
  const { sessionId, refetch: cart_refetch } = useCart();

  const [addToCart, { isLoading: isAddingAuth }] = useAddToCartMutation();
  const [addToCartGuest, { isLoading: isAddingGuest }] = useAddToCartGuestMutation();
  const isLoading = isAddingAuth || isAddingGuest;

  // Add to cart handler
  const handleAddToCart = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const access = Cookies.get("access");
    const shopname = Cookies.get("shopname") || "techend";

    const mutation = access ? addToCart : addToCartGuest;
    const args = access
      ? { product: product.id, token: access, shopname }
      : { productId: product.id.toString(), quantity: 1, sessionId, companyName: shopname };

    try {
      await mutation(args).unwrap();
      cart_refetch();
      toast.success("Product added to cart!");
      triggerCartRefetch();
    } catch (err: any) {
      const msg = err.data?.error || "An error occurred";
      toast.error(msg);
    }
  };

  // WhatsApp handler
  const handleWhatsApp = (event: React.MouseEvent) => {
    event.stopPropagation();
    const shopDetails = Cookies.get("shopDetails");
    if (!shopDetails) return toast.error("Shop details not found.");

    try {
      const company = JSON.parse(shopDetails);
      const raw = company.contact_phone.replace(/\D/g, "");
      const phone = raw.startsWith("0") ? `254${raw.slice(1)}` : raw;
      if (!phone) return toast.error("Shop owner's phone not available.");

      const price = product.on_sale ? product.discounted_price : product.price;
      const msg = `Hello, I'm interested in ${product.title} for Ksh ${price}.`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    } catch {
      toast.error("Could not retrieve shop details.");
    }
  };

  // Render stars
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return (
      <>
        {Array.from({ length: full }).map((_, i) => <StarIcon key={`full-${i}`} />)}
        {half === 1 && <StarHalfIcon />}
        {Array.from({ length: empty }).map((_, i) => <StarBorderIcon key={`empty-${i}`} />)}
      </>
    );
  };

  return (
    <ProductItemStyled
      onClick={() => router.push(`/product/${product.slug}`)}
      sx={{ pointerEvents: isLoading ? "none" : "auto", opacity: isLoading ? 0.6 : 1, position: "relative" }}
    >
      <ProductImageWrapper>
        {product.on_sale && (
          <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: "red", color: "white", px: 1, py: 0.5, borderRadius: 1, zIndex: 1, fontSize: "0.75rem", fontWeight: "bold" }}>
            Sale
          </Box>
        )}
        {product.stock === 0 && (
          <Box sx={{ position: "absolute", top: 8, right: 8, bgcolor: "gray", color: "white", px: 1, py: 0.5, borderRadius: 1, zIndex: 1, fontSize: "0.75rem", fontWeight: "bold" }}>
            Out of Stock
          </Box>
        )}
        {product.main_image && (
          <ProductImage
            src={`${product.main_image}`}
            alt={product.title || "Product Image"}
            width={600}      // fixed width for layout stability
            height={600}     // fixed height
            sizes="(max-width: 908px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"   // only load when near viewport
          />
        )}
      </ProductImageWrapper>

      <ProductInfoContainer>
        <Box display="flex" alignItems="center" mb={1}>
          <ProductPrice sx={{ color: product.on_sale ? "red" : "inherit", fontWeight: "bold" }}>
            Ksh {product.on_sale ? product.discounted_price : product.price}
          </ProductPrice>
          {product.on_sale && <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.secondary", ml: 1 }}>{product.price}</Typography>}
        </Box>
        {/* JECyZG7th */}

        <ProductTitle>{product.title}</ProductTitle>
        {product.description && (
          <Box sx={{ height: "40px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", "&:hover": { overflow: "visible", display: "block", height: "auto" } }}>
            <ProductDescription>{product.description}</ProductDescription>
          </Box>
        )}

        <RatingContainer>
          {renderStars(product.rating || 0)}
          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
            ({product.reviews_count || 0})
          </Typography>
        </RatingContainer>

        <IconActionsContainer>
          <IconButton onClick={handleAddToCart} disabled={product.stock === 0 || isLoading} aria-label="Add to cart">
            {isLoading ? <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} /> : <ShoppingBasketIcon sx={{ color: theme.palette.primary.main }} />}
          </IconButton>

          <IconButton onClick={() => router.push(`/product/${product.slug}`)} aria-label="View product details">
            <VisibilityIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>

          <IconButton onClick={handleWhatsApp} disabled={product.stock === 0} aria-label="Contact via WhatsApp">
            <WhatsAppIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>
        </IconActionsContainer>
      </ProductInfoContainer>

      {isLoading && (
        <Typography variant="caption" sx={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", color: "text.secondary", fontStyle: "italic" }}>
          Adding to cart...
        </Typography>
      )}
    </ProductItemStyled>
  );
};

// Memo to avoid unnecessary re-renders
export default memo(ProductCard);