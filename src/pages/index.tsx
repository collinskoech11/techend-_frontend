import { useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host || "";
  if (host.includes("cupcoutureshop.com")) {
    return {
      redirect: {
        destination: "/shop/the-cup-couture",
        permanent: false,
      },
    };
  }
  if (host.includes("boromoto.com")) {
    return {
      redirect: {
        destination: "/shop/boromoto",
        permanent: false,
      },
    };
  }
  return {
    redirect: {
      destination: "/shops",
      permanent: false,
    },
  };
};

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentDomain = window.location.hostname;
      if (currentDomain.includes("cupcoutureshop.com")) {
        router.replace("/shop/the-cup-couture");
      } else if (currentDomain.includes("boromoto.com")) {
        router.replace("/shop/boromoto");
      } else {
        router.replace("/shops");
      }
    }
  }, [router]);

  return null;
}