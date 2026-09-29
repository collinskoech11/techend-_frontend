import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type BackendConfigResponse = {
  backendUrl: string;
  port: number | null;
  source: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BackendConfigResponse>
) {
  // 1. Check discovery file in parent directory or current directory
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
            const portMatch = url.match(/:(\d+)/);
            return res.status(200).json({
              backendUrl: url,
              port: portMatch ? parseInt(portMatch[1], 10) : null,
              source: "discovery_file",
            });
          } else if (!isNaN(Number(content))) {
            const portNum = parseInt(content, 10);
            return res.status(200).json({
              backendUrl: `http://127.0.0.1:${portNum}/`,
              port: portNum,
              source: "discovery_file",
            });
          }
        }
      }
    }
  } catch (e) {
    // Ignore file read error
  }

  // 2. Check environment variables
  if (process.env.NEXT_PUBLIC_BACKEND_URI) {
    const uri = process.env.NEXT_PUBLIC_BACKEND_URI.endsWith("/")
      ? process.env.NEXT_PUBLIC_BACKEND_URI
      : `${process.env.NEXT_PUBLIC_BACKEND_URI}/`;
    const portMatch = uri.match(/:(\d+)/);
    return res.status(200).json({
      backendUrl: uri,
      port: portMatch ? parseInt(portMatch[1], 10) : null,
      source: "env",
    });
  }

  // 3. Fallback
  return res.status(200).json({
    backendUrl: "http://127.0.0.1:8000/",
    port: 8000,
    source: "default",
  });
}
