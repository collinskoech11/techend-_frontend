import Navbar from "@/Components/Navbar";
import React from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useGetCheckoutHistoryQuery } from "@/Api/services";
import { Box, Button, Typography } from "@mui/material";

function orderhistory() {
  const {
    data: checkout_data,
    error: checkout_error,
    isLoading: checkout_loading,
    refetch: checkout_refetch,
  } = useGetCheckoutHistoryQuery({ token: Cookies.get("access") });

  const HistoryItem = () => {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: "95%",
            margin: "auto",
            p: 3,
            borderRadius: "10px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            "*":{
                paddingBottom:"10px"
            }
          }}
        >
          <Typography sx={{ width: "50%" }}>12/12/2024</Typography>
          <Typography sx={{ width: "50%", textAlign: "right" }}>
            12/12/2024
          </Typography>
          <Typography sx={{ width: "50%" }}>12/12/2024</Typography>
          <Box
            sx={{ width: "50%", display: "flex", flexDirection: "row-reverse" }}
          >
            <Button sx={{ background: "#BE1E2D", color:"#fff" }}>View more</Button>
          </Box>
        </Box>
      </>
    );
  };
  return (
    <>
      <Toaster />
      <Navbar textColor={'#000'} bgColor={'#fff'}/>
      <Box sx={{ maxWidth: "700px", width: "100%", margin: "auto" }}>
        {checkout_data?.map((item) => {
            return(
                <HistoryItem key={item.id} />
            )
        })}
      </Box>
    </>
  );
}

export default orderhistory;
