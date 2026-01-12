export interface Product {
  id: number | string;
  name: string;
  price: number;
  mrp?: number; // Manufacturer's Suggested Retail Price
  discountPercent?: number;
  image: string;
  images?: string[]; // gallery
  videoUrl?: string;
  description: string;
  brand: string;
  rating: number;
  reviewCount?: number;
  inStock: boolean;
  stockCount: number;
  freeShipping: boolean;
  deliveryEstimate?: string; // e.g., "2-3 business days"
  category: string;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  questions?: ProductQuestion[];
  cart?: CartItem[];
  frequentlyBoughtWith?: number[]; // IDs of related products
  returnPolicy?: string; // e.g., "30-day return policy"
  sizeGuide?: string; // URL or key for modal
  compatibility?: string[];
  isFavorite?: boolean;
}

export interface CartItem{
  id: number;
  quantity: number;
  savedForLater?: boolean;
  product: Product;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  color?: string;
  size?: string;
  sku: string;
  inStock: boolean;
  price?: number;
  product: Product;
}

export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  verifiedPurchase: boolean;
  product: Product;
}

export interface ProductQuestion {
  id: string;
  user: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  date: string;
  product: Product;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  email?: string;
  phone: string;
  street: string;
  address?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  checkoutData: CheckoutData;
}

export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  estimatedDays: string;
  checkoutData: CheckoutData;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiry?: string;
  isDefault: boolean;
  label?: string;
  icon?: string;
  isDigitalWallet?: boolean;
  installments?: number[];
  checkoutData: CheckoutData;
}

export interface CheckoutData {
  id:number;
  address?: Address;
  shipping?: ShippingOption;
  payment?: PaymentMethod;
  promoCode?: string;
  termsAccepted?: boolean;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  paymentMethod: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joined: string;
  avatar?: string;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  rewardPoints: number;
  referralCode: string;
  referralCount: number;
  referralBonus: number;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences{
  id: number;
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
    orderUpdates: boolean;
    productUpdates: boolean;
  customer: Customer;
}

export interface DeliveryAgent {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  vehicle: string;
  rating: number;
  orderTracking: OrderTracking;
}

export interface TrackingStatus {
  id: string;
  status: 'order_placed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'failed_attempt';
  timestamp: string;
  location?: string;
  description: string;
  orderTracking: OrderTracking;
  orderHistoryTracking: OrderTracking;
}

export interface OrderTracking {
  id: string;
  orderId: string;
  currentStatus: TrackingStatus;
  estimatedDelivery: string;
  trackingNumber: string;
  courier: string;
  courierLogo: string;
  origin: OrderTrackingOrigin;
  destination: OrderTrackingDestination;
  currentLocation: OrderTrackingCurrentLocation;
  deliveryAgent: DeliveryAgent;
  statusHistory: TrackingStatus[];
  deliveryProof?: OrderTrackingDeliveryProof;
  canReschedule: boolean;
  canRedirect: boolean;
}

export interface OrderTrackingOrigin {
  id: number;
  address: string;
  lat: number;
  lng: number;
  orderTracking: OrderTracking;
}

export interface OrderTrackingDestination {
  id: number;
  address: string;
  lat: number;
  lng: number;
  orderTracking: OrderTracking;
}

export interface OrderTrackingCurrentLocation {
  id: number;
  lat: number;
  lng: number;
  timestamp: string;
  orderTracking: OrderTracking;
}

export interface OrderTrackingDeliveryProof {
  id: number;
  photo: string;
  timestamp: string;
  signature?: string;
  orderTracking: OrderTracking;
}

export interface WishlistItem{
  id:number;
  addedDate: string;
  priceDropAlert?: boolean;
  priceDropAmount?: number;
  restockAlert?: boolean;
  originalPrice?: number;
  product: Product;
}


export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface SupportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  link: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  services: string[];
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderDate: string;
  reason: string;
  comments: string;
  refundMethod: 'original' | 'store_credit';
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  returnLabelUrl?: string;
  dropoffLocation?: DropoffLocation;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  condition: 'new' | 'used' | 'damaged';
  request: ReturnRequest;
}

export interface StatusUpdate {
  id:number;
  status: string;
  timestamp: string;
  message: string;
  request: ReturnRequest;
}

export interface DropoffLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  distance: number;
  lat: number;
  lng: number;
  services: string[];
  returnRequest: ReturnRequest;
}


export interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
  minPurchase?: number;
  expiryDate: string;
  isActive: boolean;
  isUsed: boolean;
  type: 'percentage' | 'fixed' | 'free_shipping';
}

export interface SeasonalSale {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  link: string;
  startDate: string;
  endDate: string;
  isLive: boolean;
  isMemberOnly: boolean;
}

export interface BundleDeal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  image: string;
  isBOGO: boolean;
  items: BundleItem[];
}

export interface BundleItem {
  id: string;
  name: string;
  image: string;
  price: number;
  deal: BundleDeal;
}

export interface SpinToWinPrize {
  id: string;
  type: 'discount' | 'free_shipping' | 'free_item' | 'no_win';
  value: string;
  probability: number;
  description: string;
}
