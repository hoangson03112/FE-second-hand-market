export interface SummaryRowProps {
  label: string;
  amount: number;
  isPositive?: boolean;
  isBold?: boolean;
  isTotal?: boolean;
}

export interface PaymentMethodSummaryProps {
  paymentMethod: string;
  finalAmount: number;
  shippingFee: number;
  hasMixedOrders: boolean;
  codShippingAmount: number;
}

export interface PaymentSummaryMainProps {
  products: any[];
  shippingMethod: string;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: string;
  depositAmount: number;
  hasMixedOrders: boolean;
  codShippingAmount: number;
}

export interface ProductListProps {
  products: any[];
  sellers: any[];
  deliveryAddress: any;
  onShippingMethodChange: (sellerId: string, method: any) => void;
  selectedShippingMethods: any;
  shippingData: any;
  shippingLoading: boolean;
}

export interface ProductItemProps {
  product: any;
  showBorder?: boolean;
}

export interface ShopSectionProps {
  seller: any;
  products: any[];
  deliveryAddress: any;
  onShippingMethodChange: (sellerId: string, service: any) => void;
  selectedShippingMethods: any;
  shippingData: any;
  shippingLoading: boolean;
}

export interface QRPaymentProps {
  onConfirm: () => void;
  onCancel: () => void;
  qrCodeUrl: string;
  totalAmount: number;
  transactionId: string;
  timeLimit?: number;
}

export interface ShippingMethodSelectorProps {
  shopName: string;
  services: any[];
  selectedService: any;
  onServiceChange: (service: any) => void;
  loading: boolean;
  error: string | null;
}
