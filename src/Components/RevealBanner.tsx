import React from "react";
import { Carousel } from "react-responsive-carousel";
import {
  BannerTextContainer,
  MainBannerContainer,
} from "@/StyledComponents/Banner";
import { ShopNowButton } from "@/StyledComponents/Buttons";
import { BannerSubTypo, RevealMainTypo } from "@/StyledComponents/Typos";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const carouselItems = [
  {
    id: 1,
    title: "Reveal The Fresh Look With Kings",
    description: "Made using clean, non-toxic ingredients, our products are designed for everyone.",
    price: "Starting at $7.99",
    imageUrl: "/assets/images2/banner-4.jpg",
  },
  {
    id: 2,
    title: "Discover Your Style",
    description: "Explore our range of sustainable and eco-friendly products.",
    price: "Starting at $9.99",
    imageUrl: "/assets/david.jpg",
  },
  {
    id: 3,
    title: "Elevate Your Wardrobe",
    description: "Experience unmatched quality and timeless designs with our exclusive collection.",
    price: "Starting at $12.99",
    imageUrl: "/assets/pexels.jpg",
  },
];


function RevealBanner() {
  return (
    <MainBannerContainer>
      <Carousel
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={2000}
        stopOnHover={true}
        swipeable={true}
      >
        {carouselItems.map((item) => (
          <div key={item.id}>
            <div
              style={{
                backgroundImage: `url(${item.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#fff',
                textAlign: 'center',
              }}
            >
              <BannerTextContainer sx={{p:3, background:"rgb(0,0,0,0.3)", borderRadius:"10px"}}>
                <RevealMainTypo sx={{fontSize:{md:"56px", xs:"30px"}}}>
                  {item.title.split(" ").map((word, index) => (
                    <React.Fragment key={index}>
                      {word} {index % 3 === 2 && <br />}
                    </React.Fragment>
                  ))}
                </RevealMainTypo>
                <BannerSubTypo sx={{ color: "#fff" }}>
                  {item.description}
                </BannerSubTypo>
                <br />
                <BannerSubTypo sx={{ color: "#fff" }}>
                  {item.price}
                </BannerSubTypo>
                <br />
                <ShopNowButton>Shop Now</ShopNowButton>
              </BannerTextContainer>
            </div>
          </div>
        ))}
      </Carousel>
    </MainBannerContainer>
  );
}

export default RevealBanner;
