import { getCompanies } from "@/Api/services";

const URL = "https://sokojunction.com"; // Replace with your actual domain

function generateSiteMap(companies) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${URL}</loc>
     </url>
     <url>
       <loc>${URL}/about</loc>
     </url>
     <url>
       <loc>${URL}/cart</loc>
     </url>
     <url>
       <loc>${URL}/checkout</loc>
     </url>
     <url>
       <loc>${URL}/company-onboarding</loc>
     </url>
     <url>
       <loc>${URL}/forgot-password</loc>
     </url>
     <url>
       <loc>${URL}/iMall</loc>
     </url>
     <url>
       <loc>${URL}/login</loc>
     </url>
     <url>
       <loc>${URL}/mobile-app</loc>
     </url>
     <url>
       <loc>${URL}/orderhistory</loc>
     </url>
     <url>
       <loc>${URL}/profile</loc>
     </url>
     <url>
       <loc>${URL}/register</loc>
     </url>
     <url>
       <loc>${URL}/shops</loc>
     </url>
     ${companies
       .map(({ sluggified_name }) => {
         return `
       <url>
           <loc>${`${URL}/shop/${sluggified_name}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

export default async function sitemap(req, res) {
  const companies = await getCompanies({}); // Fetch all companies
  res.setHeader("Content-Type", "text/xml");
  res.write(generateSiteMap(companies.results));
  res.end();
}
