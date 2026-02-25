import React, { useRef, useImperativeHandle, forwardRef } from "react";
import LinksContainerComponent from "./LinksContainerComponent";


const Navbar = forwardRef((props: any, ref: any) => {
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
Navbar.displayName = "Navbar";
export default Navbar;