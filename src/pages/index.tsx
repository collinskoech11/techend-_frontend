import { forwardRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Shop = forwardRef((props: any, ref: any) => {
  const router = useRouter();
  const cartRef = useRef<any>(null);

  const [shopname, setShopName] = useState<string | undefined>(undefined);

  useEffect(() => {
    // if (router.isReady) {
      const urlShopName = router.query.shopname as string || "techend";

      if (urlShopName) {
        setShopName(urlShopName);
        Cookies.set("shopname", urlShopName, { expires: 7 });
        router.replace(`/_/${urlShopName}`);
      }
    // }
  }, [router.isReady, router.query.shopname]);

  return null;
});

export default Shop;
