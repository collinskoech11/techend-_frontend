import React, { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useGetCompanyBySlugQuery } from '@/Api/services';

export const ThemeContext = createContext({
  setPrimaryColor: (_color: string) => {},
});

const DEFAULT_BRAND_URLS = ["/shops", "/", "/about", "/contact","/company-onboarding","/profile"];
const DEFAULT_PRIMARY_COLOR = "#1976d2";

export const ThemeProvider = ({ children }) => {
  const router = useRouter();
  const cookieShop = Cookies.get("shopname");
  const isDefaultBrandPage = DEFAULT_BRAND_URLS.includes(router.pathname);

  // Determine which shop to fetch
  const displayShopName = isDefaultBrandPage ? "SokoJunction" : cookieShop || "SokoJunction";

  const { data: companyData } = useGetCompanyBySlugQuery(displayShopName, {
    skip: isDefaultBrandPage || !cookieShop,
  });
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY_COLOR);

  // Update primary color once company data is loaded
  useEffect(() => {
    if (isDefaultBrandPage) {
      setPrimaryColor(DEFAULT_PRIMARY_COLOR);
      return;
    }

    if (companyData?.primary_color) {
      setPrimaryColor(companyData.primary_color);
    } else {
      setPrimaryColor(DEFAULT_PRIMARY_COLOR);
    }
  }, [companyData, isDefaultBrandPage]);

  const theme = useMemo(() => createAppTheme(primaryColor), [primaryColor]);

  return (
    <ThemeContext.Provider value={{ setPrimaryColor }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};