import React, {useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import { useRouter } from "next/router";
import LinksContainerComponent from "./LinksContainerComponent";
import  Cookies from "js-cookie";
import { useGetCartQuery } from "@/Api/services";


const Navbar = forwardRef((props:any, ref:any) => {
  Navbar.displayName = "Navbar";
    const cartRef = useRef<any>(null);
  const router = useRouter();
  const { data: cart_data, error: cart_error, isLoading: cart_loading, refetch: cart_refetch } = useGetCartQuery({token: Cookies.get("access"), company_name: Cookies.get('shopname')});
  const navigate = (link:string) => {
    router.push(link);
  };
  const [username, setUsername] = useState<any>(null)
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
  const user = Cookies.get("username");
  useEffect(() => {
    // Get the user from cookies
    if (user) {
      // setUsername(JSON.parse(user).username);
      setUsername(user);
    }
  }, [user]);
  return(
    <>
      <LinksContainerComponent ref={cartRef}/>
    </>
  );
}
)

export default Navbar;