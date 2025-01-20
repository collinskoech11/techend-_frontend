import React, {useEffect, useState} from "react";
import {
  ButtonsContainer,
  MainNav,
  OfferNav,
} from "@/StyledComponents/NavComponents";
import {
  CartBalanceTypo,
  HeaderTypo,
  OfferNavTypo,
} from "@/StyledComponents/Typos";
import { LoginButton } from "@/StyledComponents/Buttons";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { useRouter } from "next/router";
import LinksContainerComponent from "./LinksContainerComponent";
import  Cookies from "js-cookie";
import { useGetCartQuery } from "@/Api/services";


function Navbar({textColor, bgColor}) {
  const router = useRouter();
  const { data: cart_data, error: cart_error, isLoading: cart_loading, refetch: cart_refetch } = useGetCartQuery({token: Cookies.get("access")});
  const navigate = (link:string) => {
    router.push(link);
  };
  const [username, setUsername] = useState<any>(null)

  const user = Cookies.get("username");
  useEffect(() => {
    // Get the user from cookies
    if (user) {
      // setUsername(JSON.parse(user).username);
      setUsername(user);
    }
  }, []);
  return(
    <>
      {/* <OfferNav>
        <OfferNavTypo>FREE SHIPPING ON ALL ORDERS KES 2000</OfferNavTypo>
      </OfferNav> */}
      {/* <MainNav>
        <HeaderTypo>TECHENDFORGRANTED</HeaderTypo>
        <ButtonsContainer>
        {username ? (
          <span>{username}</span>
        ) : (
          <LoginButton onClick={() => navigate("/login")}>
            Login/Register
          </LoginButton>
        )}
          <StarBorderIcon></StarBorderIcon>
          <CartBalanceTypo>${cart_data?.total || "0.00"}</CartBalanceTypo>
          <LocalMallIcon onClick={() => navigate("/cart")} />
        </ButtonsContainer>
      </MainNav> */}
      <LinksContainerComponent textColor={textColor} bgColor={bgColor}/>
    </>
  );
}

export default Navbar;