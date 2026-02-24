import Head from "next/head";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <>
      <Head>
        <title>Techend</title>
      </Head>
      <Box
        sx={{
          backgroundImage: {
            xs: 'url("/assets/mobile.svg")', // For extra-small screens (mobile)
            sm: 'url("/assets/bg.svg")',     // For small screens and up
          },        
          width: "100vw",
          height: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></Box>
    </>
  );
}
