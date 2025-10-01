// API helper simple et fiable
export async function fetcher(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// Types de base
export interface Restaurant {
  id: string;
  name: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  restaurantId: string;
  restaurant?: Restaurant;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  restaurantId: string;
  restaurant?: Restaurant;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  unit?: string;
  minStock?: number;
  restaurantId: string;
  locationId?: string;
  supplierId?: string;
  location?: Location;
  supplier?: Supplier;
  createdAt: string;
  updatedAt: string;
}

export interface StockItem {
  id: string;
  name: string;
  sku?: string | null;
  unit?: string | null;
  totalQty: number;
  locations: { locationId: string; locationName: string; qty: number }[];
}

export interface StockMovement {
  id: string;
  restaurantId: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  note?: string;
  fromLocationId?: string;
  toLocationId?: string;
  createdAt: string;
}

export interface Attribute {
  id: string;
  restaurantId: string;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BARCODE' | 'SELECTION';
  order: number;
  createdAt: string;
  updatedAt: string;
  values?: ProductAttribute[];
}

export interface ProductAttribute {
  id: string;
  productId: string;
  attributeId: string;
  valueText?: string | null;
  valueNumber?: number | null;
  valueDate?: string | null;
  attribute?: Attribute;
}

// Configuration de l'API
const API_BASE_URL = 'http://localhost:3001';

// Client API générique
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Méthodes GET
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // Méthodes POST
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Méthodes PUT
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Méthodes DELETE
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instance du client API
export const apiClient = new ApiClient(API_BASE_URL);

// Services spécialisés
export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/api/products'),
  getById: (id: string) => apiClient.get<Product>(`/api/products/${id}`),
  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<Product>('/api/products', data),
  update: (id: string, data: Partial<Product>) => 
    apiClient.put<Product>(`/api/products/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/products/${id}`),
};

export const locationsApi = {
  getAll: () => apiClient.get<Location[]>('/api/locations'),
  getById: (id: string) => apiClient.get<Location>(`/api/locations/${id}`),
  create: (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<Location>('/api/locations', data),
  update: (id: string, data: Partial<Location>) => 
    apiClient.put<Location>(`/api/locations/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/locations/${id}`),
};

export const suppliersApi = {
  getAll: () => apiClient.get<Supplier[]>('/api/suppliers'),
  getById: (id: string) => apiClient.get<Supplier>(`/api/suppliers/${id}`),
  create: (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<Supplier>('/api/suppliers', data),
  update: (id: string, data: Partial<Supplier>) => 
    apiClient.put<Supplier>(`/api/suppliers/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/suppliers/${id}`),
};

export const stockApi = {
  getItems: (restaurantId: string) => 
    apiClient.get<StockItem[]>(`/api/stock/items?restaurantId=${restaurantId}`),
  createMovement: (data: Omit<StockMovement, 'id' | 'createdAt'>) => 
    apiClient.post<StockMovement>('/api/stock/movements', data),
};

export const attributesApi = {
  getAll: (restaurantId: string) => 
    apiClient.get<Attribute[]>(`/api/attributes?restaurantId=${restaurantId}`),
  create: (data: Omit<Attribute, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => 
    apiClient.post<Attribute>('/api/attributes', data),
  update: (id: string, data: { name: string; type: string }) => 
    apiClient.put<Attribute>(`/api/attributes/${id}`, data),
  delete: (id: string) => 
    apiClient.delete<void>(`/api/attributes/${id}`),
  reorder: (restaurantId: string, attributeOrders: { id: string; order: number }[]) => 
    apiClient.put<{ success: boolean }>('/api/attributes/reorder', { restaurantId, attributeOrders }),
  assignToProduct: (attributeId: string, productId: string, value: any) => 
    apiClient.post<ProductAttribute>(`/api/attributes/${attributeId}/assign`, { productId, value }),
  getByProduct: (productId: string) => 
    apiClient.get<ProductAttribute[]>(`/api/attributes/product/${productId}`),
  removeFromProduct: (productId: string, attributeId: string) => 
    apiClient.delete<void>(`/api/attributes/product/${productId}/${attributeId}`),
};

// Health check
export const healthApi = {
  check: () => apiClient.get<{ ok: boolean; service: string }>('/health'),
};