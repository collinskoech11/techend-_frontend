import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import dotenv from "dotenv";
import Cookies from "js-cookie";


dotenv.config();
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URI || "https://techend-backend-j45c.onrender.com/";
export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (token) => ({
        url: `users/get_user_details/?token=${token}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    userRegistration: builder.mutation({
      query: data => ({
        url: 'users/register/',
        method: 'POST',
        body: data.body
      })
    }),
    userLogin: builder.mutation({
      query: data => ({
        url: 'users/login/',
        method: 'POST',
        body: data.body
      })
    }),
    getProducts: builder.query({
      query: data => ({
        url: `products/all/?company=${data.company}&category=${data.category}`,
        method: "GET"
      }),
    }),
    getProduct: builder.query({
      query: (id) => ({
        url: `products/singleproduct/${id}/`,
        method: "GET"
      }),
    }),
    addToCart: builder.mutation({
      query: (data) => {
        const shopname = Cookies.get("shopname") || "techend";
        const token = Cookies.get("access");

        return {
          url: `cart/cart/add/${data.product}/${shopname}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    addProductQtyToCart: builder.mutation({
      query: data => ({
        url: `cart/cart-item/${data.product}/${data.product_action_symbol}/${data.shopname}/`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }),
    }),
    removeProductFromCart: builder.mutation({
      query: data => ({
        url: `cart/cart-item-delete/${data.product}/${data.shopname}/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }),
    }),
    getCart: builder.query({
      query: ({ token, company_name }) => ({
        url: `cart/cart/${company_name}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    checkoutCart: builder.mutation({
      query: data => ({
        url: `cart/checkout/${data.company_name}/`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: {
          firstName: data.body.firstName,
          lastName: data.body.lastName,
          phoneNumber: data.body.phoneNumber,
          postal_code: data.body.postal_code,
          address: data.body.address,
          city: data.body.city,
          state: data.body.state,
          country: data.body.country,
          payment_method: data.body.payment_method,
        }
      }),
    }),
    getCheckoutHistory: builder.query({
      query: data => ({
        url: `cart/past-checkouts/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }),
    }),
    getCompany: builder.query({
      query: (token) => ({
        url: `companies/my/status/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    createCompany: builder.mutation({
      query: (data) => ({
        url: `companies/my/create/`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data.body,
      }),
    }),
    updateCompany: builder.mutation({
      query: (data) => ({
        url: `companies/my/onboard/`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data.body,
      }),
    }),
    getCompanies: builder.query({
      query: data => ({
        url: `companies/all/`,
        method: "GET"
      }),
    }),
    requestPasswordReset: builder.mutation({
      query: data => ({
        url: `auth/send-reset-otp/`,
        method: "POST",
        body:  data.body
      }),
    }),
    confirmPasswordReset: builder.mutation({
      query: data => ({
        url: `auth/verify-reset-otp/`,
        method: "POST",
        body: data.body
      }),
    }),
  })
});
export const {
  useGetUserQuery,
  useUserRegistrationMutation,
  useUserLoginMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useAddToCartMutation,
  useAddProductQtyToCartMutation,
  useRemoveProductFromCartMutation,
  useGetCartQuery,
  useCheckoutCartMutation,
  useGetCheckoutHistoryQuery,
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useGetCompaniesQuery,
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
}: any = AuthApi;
