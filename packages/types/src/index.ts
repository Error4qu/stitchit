// User & Auth Types
export type UserRole = 'CUSTOMER' | 'TAILOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

// Catalog Types
export interface Fabric {
  id: string;
  name: string;
  type: string;
  description: string;
  pricePerMeter: number;
  imageUrl: string;
  inStock: boolean;
}

export interface Style {
  id: string;
  name: string;
  category: 'shirt' | 'sherwani' | 'pants' | 'jacket' | 'dress';
  description: string;
  basePrice: number;
  imageUrl: string;
  customizationOptions: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'collar' | 'sleeve' | 'fit' | 'length' | 'button';
  choices: CustomizationChoice[];
}

export interface CustomizationChoice {
  id: string;
  name: string;
  priceAdjustment: number;
}

// Order Types
export type OrderStatus = 
  | 'PLACED' 
  | 'TAILOR_ASSIGNED' 
  | 'VISIT_SCHEDULED' 
  | 'MEASUREMENTS_TAKEN' 
  | 'STITCHING' 
  | 'QC_PENDING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'RETURNED';

export interface Order {
  id: string;
  customerId: string;
  tailorId?: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Address;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  styleId: string;
  fabricId: string;
  quantity: number;
  price: number;
  customizations: Record<string, string>;
}

// Tailor Visit & Measurement Types
export interface TailorVisit {
  id: string;
  orderId: string;
  tailorId: string;
  scheduledDate: string;
  actualVisitDate?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface Measurement {
  id: string;
  orderId: string;
  garmentType: string;
  measurements: Record<string, number>;
  photos: string[];
  submittedAt: string;
  submittedBy: string;
}

// Shipment Types
export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
  shippedAt: string;
  deliveredAt?: string;
}

// Review Types
export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  tailorRating: number;
  garmentRating: number;
  comment: string;
  createdAt: string;
}

// Notification Types
export type NotificationType = 'ORDER_UPDATE' | 'VISIT_SCHEDULED' | 'SHIPMENT_UPDATE' | 'REVIEW_REQUEST';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
