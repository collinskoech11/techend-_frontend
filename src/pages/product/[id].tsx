import Navbar from "@/Components/Navbar";
import React, { useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import { useRouter } from "next/router";
import { useGetProductQuery } from "@/Api/services";
import Footer from "@/Components/Footer";
import { Box, Typography, Button, Grid } from "@mui/material";
import { styled } from "@mui/system";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

// Styled components
const ProductContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "20px",
  gap: "20px",
  margin: "20px auto",
  maxWidth: "1200px",
});

const CarouselImage = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "cover",
  borderRadius: "10px",
});

const ProductDetails = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

const ProductTitle = styled(Typography)({
  fontSize: "24px",
  fontWeight: "bold",
});

const ProductPrice = styled(Typography)({
  fontSize: "20px",
  color: "#0C0C4C",
  fontWeight: "bold",
});

const AddToCartButton = styled(Button)({
  backgroundColor: "#0C0C4C",
  color: "#fff",
  textTransform: "capitalize",
  padding: "10px 20px",
  borderRadius: "5px",
  '&:hover': {
    backgroundColor: "#333",
  },
});

function ProductDetailView() {
  const router = useRouter();
  const id = router.query.id;
  const { data: product, error, isLoading } = useGetProductQuery(id);
const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  return (
    <>
      {/* <Navbar textColor={"#000"} bgColor={"#fff"} /> */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ padding: "20px" }}>
        <Link underline="hover" color="inherit" href="/">
          TechEnd
        </Link>
        <Link underline="hover" color="inherit" href="/shop">
          Shop
        </Link>
        <Typography color="text.primary">
          {isLoading ? <Skeleton width={150} /> : product?.title}
        </Typography>
      </Breadcrumbs>

      <ProductContainer>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height={400} />
            ) : (
              <>
                <Swiper
                  pagination={{ clickable: true }}
                  modules={[Pagination, Autoplay, Thumbs]}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  thumbs={{ swiper: thumbsSwiper }}
                  style={{ borderRadius: "10px" }}
                >
                  {[1, 2, 3].map((_, index) => (
                    <SwiperSlide key={index}>
                      <CarouselImage
                        src={`https://res.cloudinary.com/dqokryv6u/${product?.main_image}`}
                        alt={product.title}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Box sx={{ mt: 2 }}>
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={3}
                    freeMode={true}
                    watchSlidesProgress
                    modules={[Thumbs]}
                  >
                    {[1, 2, 3].map((_, index) => (
                      <SwiperSlide key={index}>
                        <CarouselImage
                          src={`https://res.cloudinary.com/dqokryv6u/${product?.main_image}`}
                          alt={`Thumbnail ${index + 1}`}
                          style={{ height: "100px", cursor: "pointer" }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </>
            )}

          </Grid>
          <Grid item xs={12} md={6}>
            <ProductDetails>
              {isLoading ? (
                <>
                  <Skeleton width="80%" height={40} />
                  <Skeleton width="60%" height={30} />
                  <Skeleton width="40%" height={20} />
                  <Skeleton width="30%" height={20} />
                  <Skeleton width="50%" height={20} />
                  <Skeleton width="50%" height={36} sx={{ mt: 2 }} />
                </>
              ) : (
                <>
                  <ProductTitle>{product.title}</ProductTitle>
                  <ProductPrice>${product.price}</ProductPrice>
                  <Typography>Color: {product.color}</Typography>
                  <Typography>Size: {product.size}</Typography>
                  <Typography>Rating: {product.rating} / 5</Typography>
                  <AddToCartButton>Add to Cart</AddToCartButton>
                </>
              )}
            </ProductDetails>
          </Grid>
        </Grid>
      </ProductContainer>

      {/* <Footer /> */}
    </>
  );
}

export default ProductDetailView;
