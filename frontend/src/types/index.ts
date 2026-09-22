export type Role = 'ADMIN' | 'CUSTOMER';
export type ProductType = 'SIMPLE' | 'VARIABLE';
export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  addresses?: Address[];
  _count?: {
    addresses?: number;
    blogPosts?: number;
  };
}

export interface Address {
  id: string;
  userId: string;
  title: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  displayOrder: number;
  _count?: {
    products?: number;
    children?: number;
  };
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  name: string;
  value: string;
  colorHex?: string | null;
  image?: string | null;
  attribute?: Attribute;
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  displayType?: 'COLOR' | 'IMAGE' | 'TEXT' | string;
  values?: AttributeValue[];
  _count?: {
    productAttributes?: number;
  };
}

export interface VariantAttributeValue {
  id: string;
  variantId: string;
  attributeValueId: string;
  attributeValue: AttributeValue;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: string | number;
  salePrice?: string | number | null;
  stockQuantity: number;
  image?: string | null;
  weight?: string | number | null;
  dimensions?: string | null;
  isActive: boolean;
  attributeValues?: VariantAttributeValue[];
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  attributeId: string;
  isVariation: boolean;
  attribute: Attribute;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  productType: ProductType;
  description: string;
  shortDescription?: string | null;
  basePrice: string | number;
  salePrice?: string | number | null;
  stockQuantity: number;
  manageStock: boolean;
  dimensions?: string | null;
  weight?: string | number | null;
  featured: boolean;
  status: ProductStatus;
  categoryId?: string | null;
  category?: Category | null;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  _count?: {
    variants?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  parent?: BlogCategory | null;
  children?: BlogCategory[];
  displayOrder?: number;
  _count?: {
    posts?: number;
    children?: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  status: PostStatus;
  authorId: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  categoryId?: string | null;
  category?: BlogCategory | null;
  publishedAt?: string | null;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
