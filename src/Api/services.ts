import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import dotenv from "dotenv";
import Cookies from "js-cookie";
import { Paginated, Product, Company, CheckoutResponse, CheckoutFormData, PickupLocation, DeliveryLocation, Cart, GuestOrderResponse, GuestPlaceOrderArgs, LipaNaMpesaResponse } from "@/Types";

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
    getCompanyBySlug: builder.query({
      query: (slug) => ({
        url: `companies/slug/${slug}/`,
        method: "GET",
      }),
    }),
    getProducts: builder.query<Paginated<Product>, { company?: string; category?: string; page?: number; page_size?: number; search?: string; on_sale?: boolean; }>({
      query: ({ company, category, page, page_size, search, on_sale }) => {
        const params = new URLSearchParams();
        if (company) {
          params.append('company', company);
        }
        if (category) {
          params.append('category', category);
        }
        if (page) {
          params.append('page', page.toString());
        }
        if (page_size) {
          params.append('page_size', page_size.toString());
        }
        if (search) {
          params.append('search', search);
        }
        if (on_sale) {
          params.append('on_sale', 'true');
        }
        const queryString = params.toString();
        return {
          url: `/products/all/${queryString ? `?${queryString}` : ''}`,
          method: "GET"
        };
      },
    }),
    getProduct: builder.query({
      query: (slug) => ({
        url: `products/singleproduct/${slug}/`,
        method: "GET"
      }),
    }),
    addToCart: builder.mutation({
      query: (data) => {
        const shopname = Cookies.get("shopname") || "techend";
        const token = Cookies.get("access");

        return {
          url: `cart/add/${data.product}/${shopname}/`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    addProductQtyToCart: builder.mutation({
      query: data => ({
        url: `cart/item/update/${data.product}/${data.product_action_symbol}/${data.shopname}/`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }),
    }),
    removeProductFromCart: builder.mutation({
      query: data => ({
        url: `cart/item/delete/${data.product}/${data.shopname}/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }),
    }),
    getCart: builder.query({
      query: ({ token, company_name }) => ({
        url: `cart/${company_name}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    addToCartGuest: builder.mutation<Cart, { productId: string; quantity: number; sessionId: string; companyName: string; }>({ 
      query: ({ productId, quantity, sessionId, companyName }) => ({
        url: `cart/add/${productId}/${companyName}/`,
        method: "POST",
        body: { quantity, session_id: sessionId, company_slug: companyName },
      }),
    }),
    getCartGuest: builder.query<Cart, {session_id:string, company_name:string}>({
      query: ({session_id, company_name}) => `/cart/session/${session_id}/${company_name}/`,
    }),
    placeOrderGuest: builder.mutation<GuestOrderResponse, GuestPlaceOrderArgs>({
      query: ({ sessionId, email, company_name, ...rest }) => ({
        url: `/cart/guest-checkout/${company_name}/`,
        method: "POST",
        body: { session_id: sessionId, email, ...rest },
      }),
    }),
    checkoutCart: builder.mutation<CheckoutResponse, { body: CheckoutFormData; token: string; company_name: string }>({
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
          pickup_location: data.body.pickup_location,
          delivery_location: data.body.delivery_location,
        }
      }),
    }),
    lipaNaMpesa: builder.mutation<LipaNaMpesaResponse, { order_id: string; token: string; session_id?: string }>({
      query: ({ order_id, token, session_id }) => ({
        url: `cart/lipa-na-mpesa/${order_id}/`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: session_id ? { session_id } : undefined,
      }),
    }),
    getOrderById: builder.query({
      query: ({ order_id, token }) => ({
        url: `cart/orders/${order_id}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getCheckoutHistory: builder.query({
      query: data => ({
        url: `cart/orders/past/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }),
    }),
    getPickupLocations: builder.query<PickupLocation[], { company_slug: string, token: string }>({ // New endpoint
      query: ({ company_slug, token }) => ({
        url: `companies/${company_slug}/pickup-locations/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getDeliveryLocations: builder.query<DeliveryLocation[], { company_slug: string, token: string }>({ // New endpoint
      query: ({ company_slug, token }) => ({
        url: `companies/${company_slug}/delivery-locations/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
    getCompanies: builder.query<Paginated<Company>, { page?: number; page_size?: number }>({
      query: ({ page = 1, page_size = 10 }) => ({
        url: `companies/all/?page=${page}&page_size=${page_size}`,
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
    createPickupLocation: builder.mutation<PickupLocation, { company_slug: string; token: string; body: Partial<PickupLocation> }>({ // New mutation
      query: ({ company_slug, token, body }) => ({
        url: `companies/${company_slug}/pickup-locations/`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
    }),
    createContactMessage: builder.mutation({
      query: (data) => ({
        url: `api/contact/`,
        method: "POST",
        body: data.body,
      }),
    }),
    updatePaymentStatus: builder.mutation({
      query: ({ token, pk }) => ({
        url: `cart/update-payment-status/${pk}/`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          payment_status: "Paid",
        },
      }),
    }),
  })
});
export const {
  useGetUserQuery,
  useUserRegistrationMutation,
  useUserLoginMutation,
  useGetCompanyBySlugQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useAddToCartMutation,
  useAddProductQtyToCartMutation,
  useRemoveProductFromCartMutation,
  useGetCartQuery,
  useCheckoutCartMutation,
  useLipaNaMpesaMutation, // Added
  useGetOrderByIdQuery, // Added
  useGetCheckoutHistoryQuery,
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useGetCompaniesQuery,
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
  useGetPickupLocationsQuery,
  useGetDeliveryLocationsQuery,
  useCreatePickupLocationMutation,
  useCreateContactMessageMutation,
  useUpdatePaymentStatusMutation,
  useAddToCartGuestMutation,
  useGetCartGuestQuery,
  usePlaceOrderGuestMutation,
}: any = AuthApi;

export const getProducts = async (args: { company?: string; category?: string; page?: number; page_size?: number; search?: string; on_sale?: boolean; }) => {
  const params = new URLSearchParams();
  if (args.company) {
    params.append('company', args.company);
  }
  if (args.category) {
    params.append('category', args.category);
  }
  if (args.page) {
    params.append('page', args.page.toString());
  }
  if (args.page_size) {
    params.append('page_size', args.page_size.toString());
  }
  if (args.search) {
    params.append('search', args.search);
  }
  if (args.on_sale) {
    params.append('on_sale', 'true');
  }
  const queryString = params.toString();
  const response = await fetch(`${baseUrl}products/all/${queryString ? `?${queryString}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const getCompanyBySlug = async (slug: string) => {
  const response = await fetch(`${baseUrl}companies/slug/${slug}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch company by slug');
  }
  return response.json();
};

export const getCompanies = async (args: { page?: number; page_size?: number } = {}) => {
  const params = new URLSearchParams();
  if (args.page) {
    params.append('page', args.page.toString());
  }
  if (args.page_size) {
    params.append('page_size', args.page_size.toString());
  }
  const queryString = params.toString();
  const response = await fetch(`${baseUrl}companies/all/${queryString ? `?${queryString}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  return response.json();
};