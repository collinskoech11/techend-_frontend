import Navbar from "@/Components/Navbar";
import { BreadCrumbContainer } from "@/StyledComponents/BreadCrumb";
import { YellowButton } from "@/StyledComponents/Buttons";
import {
  CartSummarySub,
  CartSummaryContent,
} from "@/StyledComponents/CartComponents";
import {
  FormContainer,
  MainCheckoutBody,
  ShippingCheckBox,
  ShippingCheckBoxWrap,
  ShippingInput,
  ShippingInputLabel,
  ShippingMainContainer,
  ShippingSubContainerMain,
  ShippingSubContainerSub,
  ShippingTitle,
} from "@/StyledComponents/CheckoutComponents";
import {
  Breadcrumbs,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCheckoutCartMutation, useGetCartQuery } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

function Checkout() {
  const [checkoutFx, { isLoading, error }] = useCheckoutCartMutation();
  const [formData, setFormData] = useState({
    firstName:"",
    lastName:"",  
    phoneNumber:"",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    payment_method: "",
  });
  const router = useRouter();
  const { data: cart_data, error: cart_error, isLoading: cart_loading, refetch: cart_refetch } = useGetCartQuery({token: Cookies.get("access")});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkoutFxSubmit = async () => {
    try {
      const response = await checkoutFx({ body: formData, token: Cookies.get("access") });
      if (response.data) {
        const data = response.data;
        toast.success(
          <>
            <Typography>Order Placed successfully</Typography>
          </>
        );
        router.push("/shop");
        // Redirect or show success message
      } else if (response.error) {
        toast.error(
          <>
            <Typography>{response.error.data.non_field_errors[0]}</Typography>
          </>
        );
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };
  const [suBtotal, setSuBtotal] = useState<any>(cart_data?.total);
  useEffect(() => {
        setSuBtotal(cart_data?.total);
  }, [suBtotal]);
  return (
    <>
      <Toaster />
      <Navbar textColor={'#000'} bgColor={'#fff'}/>
      <MainCheckoutBody>
        <BreadCrumbContainer
          sx={{
            background: "#fff",
            border: "none",
            maxWidth: "100vw",
            width: "100%",
            mb: 4,
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              KINGSMAN
            </Link>
            <Link underline="hover" color="inherit" href="/shop">
              Shop
            </Link>
            <Link underline="hover" color="inherit" href="/cart">
              Cart
            </Link>
            <Link underline="hover" color="inherit" href="/checkout">
              Checkout
            </Link>
          </Breadcrumbs>
        </BreadCrumbContainer>
        <ShippingMainContainer>
          <ShippingSubContainerMain>
            <ShippingTitle>Billing Address</ShippingTitle>
            <br />
            <FormContainer
              sx={{
                display: "flex",
                flexDirection: "row",
                minHeight: "100px",
                justifyContent: "space-around",
                flexWrap: "wrap",
                padding: "20px 0",
              }}
            >
              <ShippingInput
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <ShippingInput
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <ShippingInput
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <ShippingInput
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <ShippingInput
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              <ShippingInput
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
              <ShippingInput
                type="text"
                name="postal_code"
                placeholder="Postal code"
                value={formData.postal_code}
                onChange={handleChange}
              />
              <ShippingInput
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
              />
                            <ShippingInput
                type="text"
                name="payment_method"
                placeholder="Payment Method"
                value={formData.payment_method}
                onChange={handleChange}
              />
              <ShippingCheckBoxWrap
                control={<ShippingCheckBox />}
                label="Create an account"
              />
              <ShippingCheckBoxWrap
                control={<ShippingCheckBox />}
                label="Ship to different address"
              />
            </FormContainer>
          </ShippingSubContainerMain>
          <ShippingSubContainerSub>
            <ShippingTitle>Order Total</ShippingTitle>
            <br />
            <FormContainer sx={{ padding: "10px" }}>
              <CartSummarySub>
                <Typography sx={{ padding: "5PX" }}>Products</Typography>
                <CartSummaryContent sx={{ borderBottom: "none" }}>
                  <span>subtotal</span>
                  <span>$ {cart_data?.total}</span>
                </CartSummaryContent>
                <CartSummaryContent>
                  <span>shipping</span>
                  <span>$150</span>
                </CartSummaryContent>
                <CartSummaryContent>
                  <span style={{ fontWeight: "800" }}>Total</span>
                  <span style={{ fontWeight: "800" }}>$ {cart_data?.total + 150}</span>
                </CartSummaryContent>
              </CartSummarySub>
            </FormContainer>
            <br />
            <ShippingTitle>Order Total</ShippingTitle>
            <br />
            <FormContainer sx={{ padding: "15px" }}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
              <br />
              <YellowButton onClick={() => checkoutFxSubmit()}>Place Order</YellowButton>
            </FormContainer>
          </ShippingSubContainerSub>
        </ShippingMainContainer>
      </MainCheckoutBody>
    </>
  );
}

export default Checkout;
