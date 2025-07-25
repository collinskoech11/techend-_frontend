export interface CompanyData {
        name: string;
        description: string;
        logo_image: File | null;
        website: string;
        contact_email: string;
        contact_phone: string;
        id_number: string;
        id_front_image: File | null;
        id_back_image: File | null;
        business_registration_number: string;
        business_permit_image: File | null;
        tax_pin_number: string;
        tax_certificate_image: File | null;
        utility_bill_image: File | null;
        lease_agreement_image: File | null;
        postal_address: string;
        physical_address: string;
        country: string;
        city: string;
        state: string;
        postal_code: string;
        primary_color: string;
        secondary_color: string;
        accent_color: string;
        acceptTerms: boolean;
}

export interface YourChildProps {
    token: string | undefined;
    nextStep: () => void;
    prevStep: () => void;
    steps: string[];
    activeStep: number;
    companyData: CompanyData;
    setCompanyData: React.Dispatch<React.SetStateAction<CompanyData>>;
    companyExists?: boolean | undefined;
    refetchCompany: () => void;
    triggerRerender: () => void;
};

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  company: string;
  sluggified_name: string;
  // Add other product properties here
}

export interface Company {
  id: number;
  name: string;
  sluggified_name: string;
  description: string;
  logo_image: string;
  kyc_approved: boolean;
}