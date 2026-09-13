import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

/**
 * Checks whether a given hostname represents a white-labeled custom storefront domain.
 */
export const isCustomDomain = (hostname?: string): boolean => {
  if (typeof window === "undefined" && !hostname) return false;
  const host = (
    hostname ||
    (typeof window !== "undefined" ? window.location.hostname : "")
  )
    .toLowerCase()
    .trim();

  if (!host) return false;

  // Explicitly known custom merchant domains
  if (host.includes("cupcoutureshop.com") || host.includes("boromoto.com")) {
    return true;
  }

  // Base platform domains (not custom domains)
  const isPlatform =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith("sokojunction.com") ||
    host.endsWith(".vercel.app");

  return !isPlatform;
};

/**
 * React hook that returns true if the current page is being rendered under a custom storefront domain.
 * Supports testing override via ?custom_domain=true query param or is_custom_domain cookie.
 */
export const useIsCustomDomain = (): boolean => {
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;

      // Allow developer override for testing locally
      const queryParam = router.query.custom_domain;
      const cookieVal = Cookies.get("is_custom_domain");

      if (queryParam === "true" || cookieVal === "true") {
        setIsCustom(true);
        return;
      }
      if (queryParam === "false" || cookieVal === "false") {
        setIsCustom(false);
        return;
      }

      setIsCustom(isCustomDomain(host));
    }
  }, [router.query.custom_domain]);

  return isCustom;
};
