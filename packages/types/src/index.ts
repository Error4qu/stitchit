// ─── User & Auth ─────────────────────────────────────────────────────────────
export type UserRole = 'CUSTOMER' | 'TAILOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  provider?: string;
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

// ─── Catalog ─────────────────────────────────────────────────────────────────
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

// ─── Orders ──────────────────────────────────────────────────────────────────
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

// ─── Tailor Visit & Measurement ──────────────────────────────────────────────
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

// ─── Shipment ─────────────────────────────────────────────────────────────────
export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
  shippedAt: string;
  deliveredAt?: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  tailorRating: number;
  garmentRating: number;
  comment: string;
  createdAt: string;
}

// ─── Notifications ───────────────────────────────────────────────────────────
export type NotificationType =
  | 'ORDER_UPDATE'
  | 'VISIT_SCHEDULED'
  | 'SHIPMENT_UPDATE'
  | 'REVIEW_REQUEST'
  | 'ALTERATION_UPDATE';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ─── Alterations ─────────────────────────────────────────────────────────────
export type AlterationCategoryType =
  | 'PANT'
  | 'SHIRT'
  | 'KURTA'
  | 'JACKET'
  | 'SAREE_BLOUSE'
  | 'SUIT'
  | 'DRESS'
  | 'OTHER';

export type AlterationStatus =
  | 'BOOKED'
  | 'TAILOR_ASSIGNED'
  | 'TAILOR_VISITED'
  | 'GARMENT_COLLECTED'
  | 'IN_ALTERATION'
  | 'QUALITY_CHECK'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export type SlotTime =
  | 'MORNING_9_11'
  | 'AFTERNOON_12_2'
  | 'AFTERNOON_3_5'
  | 'EVENING_6_8';

export interface AlterationCategory {
  id: number;
  type: AlterationCategoryType;
  displayName: string;
  icon: string;
  description?: string;
  sortOrder?: number;
  serviceCount: number;
}

export interface AlterationService {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  estimatedDays?: number;
  categoryId: number;
  categoryDisplayName: string;
  icon?: string;
}

export interface AlterationOrderItem {
  id: number;
  alterationServiceId: number;
  alterationServiceName: string;
  alterationServiceIcon?: string;
  garmentDescription?: string;
  customerNotes?: string;
  price: number;
}

export interface AlterationOrder {
  id: number;
  customerId: number;
  customerName: string;
  tailorId?: number;
  tailorName?: string;
  address: Address;
  scheduledDate: string;
  scheduledSlot: SlotTime;
  scheduledSlotDisplay: string;
  status: AlterationStatus;
  items: AlterationOrderItem[];
  tailorNotes?: string;
  specialInstructions?: string;
  beforePhotos: string[];
  afterPhotos: string[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// ─── API Wrappers ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
