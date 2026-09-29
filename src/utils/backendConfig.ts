import fs from "fs";
import path from "path";

let cachedBackendUrl: string | null = null;

/**
 * Synchronously get the best-known backend URL.
 * Checks memory cache -> sessionStorage (browser) -> discovery files (.backend_port / .backend_url) -> env vars -> fallback.
 */
export const getResolvedBackendUrl = (): string => {
  if (cachedBackendUrl) {
    return cachedBackendUrl;
  }

  // 1. Client-side browser resolution
  if (typeof window !== "undefined") {
    try {
      const sessionUrl = sessionStorage.getItem("SJ_BACKEND_URL");
      if (sessionUrl) {
        cachedBackendUrl = sessionUrl;
        return sessionUrl;
      }
    } catch (e) {
      // Ignore sessionStorage access errors
    }

    if (process.env.NEXT_PUBLIC_BACKEND_URI) {
      return process.env.NEXT_PUBLIC_BACKEND_URI.endsWith("/")
        ? process.env.NEXT_PUBLIC_BACKEND_URI
        : `${process.env.NEXT_PUBLIC_BACKEND_URI}/`;
    }

    // Default fallback in local dev vs production
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://127.0.0.1:8000/";
    }

    return "https://app.sokojunction.com/";
  }

  // 2. Server-side (Node.js runtime)
  // If explicitly provided via env (e.g. from start.sh) and not default 8000
  if (process.env.NEXT_PUBLIC_BACKEND_URI && !process.env.NEXT_PUBLIC_BACKEND_URI.includes(":8000")) {
    const uri = process.env.NEXT_PUBLIC_BACKEND_URI.endsWith("/")
      ? process.env.NEXT_PUBLIC_BACKEND_URI
      : `${process.env.NEXT_PUBLIC_BACKEND_URI}/`;
    cachedBackendUrl = uri;
    return uri;
  }

  // Check discovery files written by the backend or start.sh
  try {
    const candidatePaths = [
      path.resolve(process.cwd(), "../.backend_url"),
      path.resolve(process.cwd(), ".backend_url"),
      path.resolve(process.cwd(), "../.backend_port"),
      path.resolve(process.cwd(), ".backend_port"),
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8").trim();
        if (content) {
          if (content.startsWith("http")) {
            const url = content.endsWith("/") ? content : `${content}/`;
            cachedBackendUrl = url;
            return url;
          } else if (!isNaN(Number(content))) {
            const url = `http://127.0.0.1:${content}/`;
            cachedBackendUrl = url;
            return url;
          }
        }
      }
    }
  } catch (e) {
    // Ignore file system errors
  }

  const defaultUrl = process.env.NEXT_PUBLIC_BACKEND_URI || (
    process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000/" : "https://app.sokojunction.com/"
  );
  return defaultUrl.endsWith("/") ? defaultUrl : `${defaultUrl}/`;
};

/**
 * Manually set or update the active backend URL.
 */
export const setDynamicBackendUrl = (url: string) => {
  const formattedUrl = url.endsWith("/") ? url : `${url}/`;
  cachedBackendUrl = formattedUrl;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("SJ_BACKEND_URL", formattedUrl);
    } catch (e) {}
  }
};

/**
 * Actively probe for the running Django backend.
 * Checks /api/backend-config, then candidate ports (8000..8005) against /api/health/.
 */
export const probeAndResolveBackendUrl = async (): Promise<string> => {
  if (typeof window === "undefined") {
    return getResolvedBackendUrl();
  }

  // 1. Try querying /api/backend-config from the local Next.js server
  try {
    const res = await fetch("/api/backend-config");
    if (res.ok) {
      const data = await res.json();
      if (data?.backendUrl) {
        setDynamicBackendUrl(data.backendUrl);
        return data.backendUrl;
      }
    }
  } catch (e) {}

  // 2. Probe candidate ports on localhost
  const candidatePorts = [8000, 8001, 8002, 8003, 8004, 8005];
  for (const port of candidatePorts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600);
      const res = await fetch(`http://127.0.0.1:${port}/api/health/`, {
        signal: controller.signal,
        mode: "cors",
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.service === "sokojunction-backend") {
          const activeUrl = `http://127.0.0.1:${port}/`;
          setDynamicBackendUrl(activeUrl);
          return activeUrl;
        }
      }
    } catch (e) {}
  }

  return getResolvedBackendUrl();
};
