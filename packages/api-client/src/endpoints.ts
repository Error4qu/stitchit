import type {
  User,
  Address,
  PaginatedResponse,
  AlterationCategory,
  AlterationService,
  AlterationOrder,
  PaymentCheckout,
} from '@stitchit/types';
import { ApiClient } from './api-client';

export class ApiEndpoints {
  constructor(private client: ApiClient) {}

  // ─── Auth ────────────────────────────────────────────────────────────
  login(email: string, password: string) {
    return this.client.post<User>('/auth/login', { email, password });
  }

  register(data: { name: string; email: string; password: string; phone?: string }) {
    return this.client.post<User>('/auth/register', data);
  }

  logout() {
    return this.client.post<void>('/auth/logout');
  }

  refresh() {
    return this.client.post<User>('/auth/refresh');
  }

  me() {
    return this.client.get<User>('/auth/me');
  }

  // ─── User / Profile ──────────────────────────────────────────────────
  getProfile() {
    return this.client.get<User>('/auth/me');
  }

  updateProfile(data: Partial<Pick<User, 'name' | 'phone'>>) {
    return this.client.patch<User>('/users/me', data);
  }

  // ─── Addresses ───────────────────────────────────────────────────────
  getAddresses() {
    return this.client.get<Address[]>('/addresses');
  }

  createAddress(data: Omit<Address, 'id' | 'userId'>) {
    return this.client.post<Address>('/addresses', data);
  }

  updateAddress(id: string, data: Partial<Address>) {
    return this.client.put<Address>(`/addresses/${id}`, data);
  }

  setDefaultAddress(id: string) {
    return this.client.put<Address>(`/addresses/${id}/default`);
  }

  deleteAddress(id: string) {
    return this.client.delete<void>(`/addresses/${id}`);
  }

  // ─── Payments ────────────────────────────────────────────────────────
  createPaymentCheckout(alterationOrderId: number) {
    return this.client.post<PaymentCheckout>('/payments/checkout', { alterationOrderId });
  }

  verifyPayment(data: {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
  }) {
    return this.client.post<PaymentCheckout>('/payments/verify', data);
  }

  // ─── Admin ───────────────────────────────────────────────────────────
  getAllUsers(params?: { page?: number; pageSize?: number }) {
    const query = params ? `?page=${params.page ?? 0}&size=${params.pageSize ?? 20}` : '';
    return this.client.get<PaginatedResponse<User>>(`/admin/users${query}`);
  }

  getAnalytics() {
    return this.client.get<unknown>('/admin/analytics');
  }

  // ─── Alterations ─────────────────────────────────────────────────────
  getAlterationCategories() {
    return this.client.get<AlterationCategory[]>('/alterations/categories');
  }

  getAlterationServices(categoryId: number) {
    return this.client.get<AlterationService[]>(`/alterations/categories/${categoryId}/services`);
  }

  createAlterationOrder(data: {
    addressId: number;
    scheduledDate: string;
    scheduledSlot: string;
    items: Array<{
      alterationServiceId: number;
      garmentDescription?: string;
      customerNotes?: string;
    }>;
    specialInstructions?: string;
  }) {
    return this.client.post<AlterationOrder>('/alterations/orders', data);
  }

  getMyAlterationOrders(params?: { page?: number; size?: number }) {
    const query = params ? `?page=${params.page ?? 0}&size=${params.size ?? 10}` : '';
    return this.client.get<PaginatedResponse<AlterationOrder>>(`/alterations/orders${query}`);
  }

  getTailorAlterationOrders(params?: { page?: number; size?: number }) {
    const query = params ? `?page=${params.page ?? 0}&size=${params.size ?? 10}` : '';
    return this.client.get<PaginatedResponse<AlterationOrder>>(`/alterations/orders/tailor${query}`);
  }

  getAllAlterationOrders(params?: { page?: number; size?: number }) {
    const query = params ? `?page=${params.page ?? 0}&size=${params.size ?? 20}` : '';
    return this.client.get<PaginatedResponse<AlterationOrder>>(`/alterations/orders/admin${query}`);
  }

  getAlterationOrder(orderId: number) {
    return this.client.get<AlterationOrder>(`/alterations/orders/${orderId}`);
  }

  updateAlterationStatus(orderId: number, status: string, tailorNotes?: string) {
    return this.client.patch<AlterationOrder>(`/alterations/orders/${orderId}/status`, {
      status,
      tailorNotes,
    });
  }

  uploadAlterationPhotos(orderId: number, photoType: 'BEFORE' | 'AFTER', photoUrls: string[]) {
    return this.client.post<AlterationOrder>(`/alterations/orders/${orderId}/photos`, {
      photoType,
      photoUrls,
    });
  }

  assignAlterationTailor(orderId: number, tailorId: number) {
    return this.client.post<AlterationOrder>(
      `/alterations/orders/${orderId}/assign?tailorId=${tailorId}`
    );
  }
}

export const createApiEndpoints = (client: ApiClient) => new ApiEndpoints(client);
