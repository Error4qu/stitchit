import type { 
  User, 
  Address, 
  Fabric, 
  Style, 
  Order, 
  OrderItem, 
  TailorVisit, 
  Measurement, 
  Shipment, 
  Review,
  PaginatedResponse 
} from '@stitchit/types';
import { ApiClient } from './api-client';

export class ApiEndpoints {
  constructor(private client: ApiClient) {}

  // Auth Endpoints
  async login(email: string, password: string) {
    return this.client.post<{ token: string; user: User }>('/auth/login', { email, password });
  }

  async register(data: { email: string; password: string; name: string; phone: string }) {
    return this.client.post<{ token: string; user: User }>('/auth/register', data);
  }

  async googleLogin(token: string) {
    return this.client.post<{ token: string; user: User }>('/auth/google', { token });
  }

  async refreshToken(refreshToken: string) {
    return this.client.post<{ token: string }>('/auth/refresh', { refreshToken });
  }

  // User Endpoints
  async getProfile() {
    return this.client.get<User>('/users/me');
  }

  async updateProfile(data: Partial<User>) {
    return this.client.patch<User>('/users/me', data);
  }

  // Address Endpoints
  async getAddresses() {
    return this.client.get<Address[]>('/addresses');
  }

  async createAddress(data: Omit<Address, 'id' | 'userId'>) {
    return this.client.post<Address>('/addresses', data);
  }

  async updateAddress(id: string, data: Partial<Address>) {
    return this.client.patch<Address>(`/addresses/${id}`, data);
  }

  async deleteAddress(id: string) {
    return this.client.delete<void>(`/addresses/${id}`);
  }

  // Catalog Endpoints
  async getFabrics(params?: { page?: number; pageSize?: number }) {
    return this.client.get<PaginatedResponse<Fabric>>('/fabrics', params);
  }

  async getFabric(id: string) {
    return this.client.get<Fabric>(`/fabrics/${id}`);
  }

  async getStyles(params?: { page?: number; pageSize?: number; category?: string }) {
    return this.client.get<PaginatedResponse<Style>>('/styles', params);
  }

  async getStyle(id: string) {
    return this.client.get<Style>(`/styles/${id}`);
  }

  // Cart Endpoints
  async getCart() {
    return this.client.get<OrderItem[]>('/cart');
  }

  async addToCart(item: Omit<OrderItem, 'id' | 'orderId'>) {
    return this.client.post<OrderItem>('/cart', item);
  }

  async updateCartItem(id: string, data: Partial<OrderItem>) {
    return this.client.patch<OrderItem>(`/cart/${id}`, data);
  }

  async removeFromCart(id: string) {
    return this.client.delete<void>(`/cart/${id}`);
  }

  async clearCart() {
    return this.client.delete<void>('/cart');
  }

  // Order Endpoints
  async getOrders(params?: { page?: number; pageSize?: number; status?: string }) {
    return this.client.get<PaginatedResponse<Order>>('/orders', params);
  }

  async getOrder(id: string) {
    return this.client.get<Order>(`/orders/${id}`);
  }

  async createOrder(data: { shippingAddressId: string }) {
    return this.client.post<Order>('/orders', data);
  }

  // Tailor Visit Endpoints
  async scheduleVisit(orderId: string, date: string) {
    return this.client.post<TailorVisit>('/visits', { orderId, scheduledDate: date });
  }

  async getVisits(params?: { page?: number; pageSize?: number }) {
    return this.client.get<PaginatedResponse<TailorVisit>>('/visits', params);
  }

  async updateVisit(id: string, data: Partial<TailorVisit>) {
    return this.client.patch<TailorVisit>(`/visits/${id}`, data);
  }

  // Measurement Endpoints
  async submitMeasurement(data: Omit<Measurement, 'id' | 'submittedAt'>) {
    return this.client.post<Measurement>('/measurements', data);
  }

  async getMeasurements(orderId: string) {
    return this.client.get<Measurement[]>(`/orders/${orderId}/measurements`);
  }

  // Shipment Endpoints
  async getShipment(orderId: string) {
    return this.client.get<Shipment>(`/orders/${orderId}/shipment`);
  }

  // Review Endpoints
  async createReview(data: Omit<Review, 'id' | 'createdAt'>) {
    return this.client.post<Review>('/reviews', data);
  }

  async getReviews(params?: { page?: number; pageSize?: number }) {
    return this.client.get<PaginatedResponse<Review>>('/reviews', params);
  }

  // Notification Endpoints
  async getNotifications() {
    return this.client.get('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.client.patch(`/notifications/${id}/read`, {});
  }

  // Admin Endpoints
  async getAllUsers(params?: { page?: number; pageSize?: number }) {
    return this.client.get<PaginatedResponse<User>>('/admin/users', params);
  }

  async assignTailor(orderId: string, tailorId: string) {
    return this.client.post<Order>(`/admin/orders/${orderId}/assign`, { tailorId });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.client.patch<Order>(`/admin/orders/${orderId}/status`, { status });
  }

  async getAnalytics() {
    return this.client.get('/admin/analytics');
  }
}
