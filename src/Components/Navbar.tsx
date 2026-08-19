import React, { useRef, useImperativeHandle, forwardRef } from "react";
import LinksContainerComponent from "./LinksContainerComponent";


const Navbar = forwardRef((_props: any, ref: any) => {
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
  return (
    <>
      <LinksContainerComponent ref={cartRef} />
    </>
  );
}
)
Navbar.displayName = "Navbar";
export default Navbar;