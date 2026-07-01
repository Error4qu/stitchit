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
