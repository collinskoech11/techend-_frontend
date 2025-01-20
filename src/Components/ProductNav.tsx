import { Box } from '@mui/material'
import Link from 'next/link'
import React from 'react'

function ProductNav({text, link}:any) {
  return (
    <>
    <Box sx={{width:"100vw",maxWidth:"1400px", display:"flex", justifyContent:"space-between", margin:"auto", alignItems:"center", mt:5}}>
      <Box sx={{fontWeight:"600", fontSize:"34px" }}>
      <Link href={`${link}`} style={{color:"#000", textDecoration:"none",fontFamily:"sans-serif" }}>{text}</Link>
      </Box>
      <Box sx={{ textAlign:"right"}}>
      <Link href="#" style={{color:"#000", textDecoration:"none",fontFamily:"sans-serif" }}>Shop all Products</Link>
      </Box>
    </Box>
    </>
  )
}

export default ProductNav