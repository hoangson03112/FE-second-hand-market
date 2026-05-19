// Address Types
export interface Address {
  _id: string;
  fullName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  isDefault?: boolean;
  provinceId?: string | number;
  districtId?: string | number;
  wardCode?: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: {
    url: string;
  };
  seller?: {
    _id: string;
    fullName: string;
    from_district_id?: string | number;
    from_ward_code?: string;
  };
  discount?: {
    type: string;
    value: number;
  };
}

// Shipping Types
export interface ShippingMethod {
  id: string;
  code: string;
  name: string;
  fee: number;
  estimatedTime: string;
  description?: string;
}

// Location Types
export interface Location {
  ProvinceID?: number;
  ProvinceName?: string;
  DistrictID?: number;
  DistrictName?: string;
  WardCode?: string;
  WardName?: string;
}

// Component Props

export interface AddressListProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onHide: () => void;
  currentUser: any;
}

export interface AddressModalProps {
  show: boolean;
  onHide: () => void;
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  showNewAddressForm: boolean;
  onToggleNewAddressForm: (show: boolean) => void;
  onAddNewAddress: (formData?: any) => Promise<any>;
  onAddressAdded: (address: Address) => void;
  addressFormProps: any;
}

export interface AddressSectionProps {
  selectedAddress: Address | null;
  onChangeAddress: () => void;
}

export interface CheckoutFooterProps {
  onPlaceOrder: () => void;
  isLoading?: boolean;
  hasPaymentOrders?: boolean;
}

export interface MixedOrderInfoProps {
  directMeetingCount: number;
  codShippingCount: number;
  bankTransferCount: number;
}

export interface LocationDropdownProps {
  locations: Location[];
  onSelect: (location: Location) => void;
  show: boolean;
}

export interface NewAddressFormProps {
  newAddress: any;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectProvince: (location: Location) => void;
  onSelectDistrict: (location: Location) => void;
  onSelectWard: (location: Location) => void;
  onLocationFocus: (field: string) => void;
  onLocationBlur: (field?: string) => void;
  filteredProvinces: Location[];
  filteredDistricts: Location[];
  filteredWards: Location[];
  showProvinceDropdown: boolean;
  showDistrictDropdown: boolean;
  showWardDropdown: boolean;
}

export interface PaymentOptionProps {
  method: string;
  config: any;
  isSelected: boolean;
  onSelect: (method: string) => void;
  shippingFee: number;
  finalAmount: number;
  codShippingAmount: number;
  hasMixedOrders: boolean;
}

export interface PaymentMethodSectionProps {
  products: Product[];
  paymentMethod: string;
  onPaymentMethodChange: React.Dispatch<React.SetStateAction<string>>;
  shippingFee: number;
  finalAmount: number;
  codShippingAmount: number;
  codShippingOriginalAmount: number;
  hasMixedOrders: boolean;
}

export interface PaymentSummaryProps {
  products: Product[];
  shippingMethod: string;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: string;
  depositAmount: number;
  hasMixedOrders: boolean;
  codShippingAmount: number;
}
