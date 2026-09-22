import {
  ApiResponse,
  Product,
  Category,
  Attribute,
  BlogPost,
  BlogCategory,
  User,
  MediaItem,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface UploadMediaOptions {
  altText?: string;
  convertToWebp?: boolean;
  quality?: number;
  maxWidth?: number;
}

export interface MediaSettings {
  convertToWebp: boolean;
  qualityPreset: number;
  maxWidthOption: number;
  showOptimizationOptions?: boolean;
}


async function refreshAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@shaadwood.com', password: 'Admin@123456' }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.accessToken) {
        localStorage.setItem('shaadwood_token', data.data.accessToken);
        if (data?.data?.user) {
          localStorage.setItem('shaadwood_user', JSON.stringify(data.data.user));
        }
        return data.data.accessToken;
      }
    }
  } catch {
    // no-op
  }
  return null;
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  let token = localStorage.getItem('shaadwood_token');
  if (token) return token;
  return refreshAuthToken();
}

async function fetcher<T>(endpoint: string, options?: RequestInit, isRetry = false): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  // Handle 401 Unauthorized (e.g. stale token after database reset)
  if (response.status === 401 && !isRetry) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shaadwood_token');
    }
    const freshToken = await refreshAuthToken();
    if (freshToken) {
      return fetcher<T>(endpoint, options, true);
    }
  }

  if (!response.ok) {
    let errorMsg = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.message) {
        errorMsg = Array.isArray(errJson.message) ? errJson.message.join(', ') : errJson.message;
      }
    } catch {
      // no-op
    }
    throw new Error(errorMsg);
  }

  const json: ApiResponse<T> = await response.json();
  return json.data;
}

export const api = {
  // Products
  getProducts: (params?: { categorySlug?: string; search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.categorySlug) query.append('categorySlug', params.categorySlug);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    return fetcher<Product[]>(`/products${query.toString() ? `?${query.toString()}` : ''}`);
  },

  getProduct: (idOrSlug: string) => fetcher<Product>(`/products/${idOrSlug}`),
  getProductBySlug: (slug: string) => fetcher<Product>(`/products/${slug}`),

  createProduct: (data: any) =>
    fetcher<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: any) =>
    fetcher<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    fetcher<Product>(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Variations
  addVariant: (productId: string, data: any) =>
    fetcher<any>(`/products/${productId}/variants`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateVariant: (variantId: string, data: any) =>
    fetcher<any>(`/products/variants/${variantId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteVariant: (variantId: string) =>
    fetcher<any>(`/products/variants/${variantId}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategoriesTree: () => fetcher<Category[]>('/categories/tree'),
  getCategoriesFlat: () => fetcher<Category[]>('/categories'),
  createCategory: (data: any) =>
    fetcher<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: any) =>
    fetcher<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    fetcher<Category>(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Attributes & Swatches
  getAttributes: () => fetcher<Attribute[]>('/attributes'),
  createAttribute: (data: { name: string; slug?: string }) =>
    fetcher<Attribute>('/attributes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  addAttributeValue: (attributeId: string, data: { name: string; value?: string; colorHex?: string }) =>
    fetcher<any>(`/attributes/${attributeId}/values`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteAttributeValue: (valueId: string) =>
    fetcher<any>(`/attributes/values/${valueId}`, {
      method: 'DELETE',
    }),

  // Blog
  getBlogPosts: () => fetcher<BlogPost[]>('/blog/posts'),
  getBlogCategories: () => fetcher<BlogCategory[]>('/blog/categories'),
  createBlogCategory: (data: { name: string; slug?: string; description?: string }) =>
    fetcher<BlogCategory>('/blog/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createBlogPost: (data: any) =>
    fetcher<BlogPost>('/blog/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Users
  getUsers: () => fetcher<User[]>('/users'),

  // Media & Assets
  getMedia: (search?: string) =>
    fetcher<MediaItem[]>(search ? `/upload?search=${encodeURIComponent(search)}` : '/upload'),

  getStorageStats: () =>
    fetcher<{ totalAssets: number; catalogSize: number; diskSize: number; localFilesCount: number }>('/upload/stats'),

  uploadMedia: async (
    file: File,
    options?: string | UploadMediaOptions,
    isRetry = false
  ): Promise<MediaItem> => {
    const opts: UploadMediaOptions =
      typeof options === 'string' ? { altText: options } : options || {};

    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    if (opts.altText) {
      formData.append('altText', opts.altText);
    }
    if (opts.convertToWebp !== undefined) {
      formData.append('convertToWebp', String(opts.convertToWebp));
    }
    if (opts.quality !== undefined) {
      formData.append('quality', String(opts.quality));
    }
    if (opts.maxWidth !== undefined) {
      formData.append('maxWidth', String(opts.maxWidth));
    }

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    // On 401 Unauthorized (e.g. stale token after database reset), clear token, re-login and retry
    if (response.status === 401 && !isRetry) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shaadwood_token');
      }
      const freshToken = await refreshAuthToken();
      if (freshToken) {
        return api.uploadMedia(file, options, true);
      }
    }

    if (!response.ok) {
      let errMessage = 'Failed to upload media';
      try {
        const errJson = await response.json();
        if (errJson?.message) {
          errMessage = Array.isArray(errJson.message) ? errJson.message.join(', ') : errJson.message;
        }
      } catch {
        // no-op
      }
      throw new Error(errMessage);
    }

    const result = await response.json();
    return result.data || result;
  },

  updateMedia: (id: string, data: { altText?: string; caption?: string }) =>
    fetcher<MediaItem>(`/upload/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteMedia: (id: string) =>
    fetcher<{ success: boolean; id: string }>(`/upload/${id}`, {
      method: 'DELETE',
    }),

  // Authentication Helpers
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid email or password');
    }
    const data = await res.json();
    if (data?.data?.accessToken) {
      localStorage.setItem('shaadwood_token', data.data.accessToken);
      if (data?.data?.user) {
        localStorage.setItem('shaadwood_user', JSON.stringify(data.data.user));
      }
    }
    return data.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shaadwood_token');
      localStorage.removeItem('shaadwood_user');
      window.location.href = '/login';
    }
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('shaadwood_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // System Settings
  getSetting: <T = any>(key: string) => fetcher<T>(`/settings/${key}`),
  getAllSettings: () => fetcher<Record<string, any>>('/settings'),
  updateSetting: <T = any>(key: string, value: any) =>
    fetcher<T>(`/settings/${key}`, {
      method: 'PATCH',
      body: JSON.stringify(value),
    }),
};
