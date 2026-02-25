import React, { useRef, useImperativeHandle, forwardRef } from "react";
import LinksContainerComponent from "./LinksContainerComponent";


const Navbar = forwardRef((props: any, ref: any) => {
  Navbar.displayName = "Navbar";
  console.log("Navbar rendered", props);
    const cartRef = useRef<any>(null);
  const triggerCartRefetch = () => {
    if (cartRef.current) {
 
     cartRef.current.triggerCartRefetch();
    }
  };
  useImperativeHandle(ref, () => ({
      triggerCartRefetch() {
        triggerCartRefetch();
      },
    }));
  return(
    <>
      <LinksContainerComponent ref={cartRef}/>
    </>
  );
}
)

export default Navbar;