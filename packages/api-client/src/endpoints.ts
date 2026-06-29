import type {
  User,
  Address,
  Fabric,
  Style,
  Order,
  TailorVisit,
  Measurement,
  Shipment,
  Review,
  PaginatedResponse,
  AlterationCategory,
  AlterationService,
  AlterationOrder,
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
    return this.client.patch<Address>(`/addresses/${id}`, data);
  }

  deleteAddress(id: string) {
    return this.client.delete<void>(`/addresses/${id}`);
  }

  // ─── Catalog ─────────────────────────────────────────────────────────
  getFabrics(params?: { page?: number; pageSize?: number }) {
    const query = params ? `?page=${params.page ?? 0}&size=${params.pageSize ?? 12}` : '';
    return this.client.get<PaginatedResponse<Fabric>>(`/fabrics${query}`);
  }

  getFabric(id: string) {
    return this.client.get<Fabric>(`/fabrics/${id}`);
  }

  getStyles(params?: { page?: number; pageSize?: number; category?: string }) {
    const q = new URLSearchParams();
    if (params?.page != null) q.set('page', String(params.page));
    if (params?.pageSize != null) q.set('size', String(params.pageSize));
    if (params?.category) q.set('category', params.category);
    const query = q.toString() ? `?${q.toString()}` : '';
    return this.client.get<PaginatedResponse<Style>>(`/styles${query}`);
  }

  getStyle(id: string) {
    return this.client.get<Style>(`/styles/${id}`);
  }

  // ─── Cart ────────────────────────────────────────────────────────────
  getCart() {
    return this.client.get<Order[]>('/cart');
  }

  addToCart(item: { styleId: string; fabricId: string; quantity: number; customizations: Record<string, string> }) {
    return this.client.post<Order>('/cart', item);
  }

  updateCartItem(id: string, data: { quantity: number }) {
    return this.client.patch<Order>(`/cart/${id}`, data);
  }

  removeFromCart(id: string) {
    return this.client.delete<void>(`/cart/${id}`);
  }

  clearCart() {
    return this.client.delete<void>('/cart');
  }

  // ─── Orders ──────────────────────────────────────────────────────────
  getOrders(params?: { page?: number; pageSize?: number; status?: string }) {
    const q = new URLSearchParams();
    if (params?.page != null) q.set('page', String(params.page));
    if (params?.pageSize != null) q.set('size', String(params.pageSize));
    if (params?.status) q.set('status', params.status);
    const query = q.toString() ? `?${q.toString()}` : '';
    return this.client.get<PaginatedResponse<Order>>(`/orders${query}`);
  }

  getOrder(id: string) {
    return this.client.get<Order>(`/orders/${id}`);
  }

  createOrder(data: { shippingAddressId: string }) {
    return this.client.post<Order>('/orders', data);
  }

  // ─── Tailor Visits ───────────────────────────────────────────────────
  scheduleVisit(orderId: string, date: string) {
    return this.client.post<TailorVisit>('/visits', { orderId, scheduledDate: date });
  }

  getVisits(params?: { page?: number; pageSize?: number }) {
    const query = params ? `?page=${params.page ?? 0}&size=${params.pageSize ?? 10}` : '';
    return this.client.get<PaginatedResponse<TailorVisit>>(`/visits${query}`);
  }

  updateVisit(id: string, data: Partial<TailorVisit>) {
    return this.client.patch<TailorVisit>(`/visits/${id}`, data);
  }

  // ─── Measurements ────────────────────────────────────────────────────
  submitMeasurement(data: Omit<Measurement, 'id' | 'submittedAt'>) {
    return this.client.post<Measurement>('/measurements', data);
  }

  getMeasurements(orderId: string) {
    return this.client.get<Measurement[]>(`/orders/${orderId}/measurements`);
  }

  // ─── Shipments ───────────────────────────────────────────────────────
  getShipment(orderId: string) {
    return this.client.get<Shipment>(`/orders/${orderId}/shipment`);
  }

  // ─── Reviews ─────────────────────────────────────────────────────────
  createReview(data: Omit<Review, 'id' | 'createdAt'>) {
    return this.client.post<Review>('/reviews', data);
  }

  getReviews(params?: { page?: number; pageSize?: number }) {
    const query = params ? `?page=${params.page ?? 0}&size=${params.pageSize ?? 10}` : '';
    return this.client.get<PaginatedResponse<Review>>(`/reviews${query}`);
  }

  // ─── Notifications ───────────────────────────────────────────────────
  getNotifications() {
    return this.client.get<unknown[]>('/notifications');
  }

  markNotificationRead(id: string) {
    return this.client.patch<void>(`/notifications/${id}/read`);
  }

  // ─── Admin ───────────────────────────────────────────────────────────
  getAllUsers(params?: { page?: number; pageSize?: number }) {
    const query = params ? `?page=${params.page ?? 0}&size=${params.pageSize ?? 20}` : '';
    return this.client.get<PaginatedResponse<User>>(`/admin/users${query}`);
  }

  assignTailor(orderId: string, tailorId: string) {
    return this.client.post<Order>(`/admin/orders/${orderId}/assign`, { tailorId });
  }

  updateOrderStatus(orderId: string, status: string) {
    return this.client.patch<Order>(`/admin/orders/${orderId}/status`, { status });
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
