import { Product, CreateProductRequest, UpdateProductRequest, ProductCategory } from '../../../shared/models/product.interface';

// Domain interfaces for Product module
export interface ProductRepository {
  findAll(params?: any): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: CreateProductRequest): Promise<Product>;
  update(id: string, product: UpdateProductRequest): Promise<Product>;
  delete(id: string): Promise<void>;
  findBySku(sku: string): Promise<Product | null>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findLowStock(): Promise<Product[]>;
}

export interface ProductUseCases {
  getAllProducts(params?: any): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  createProduct(productData: CreateProductRequest): Promise<Product>;
  updateProduct(id: string, productData: UpdateProductRequest): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getProductBySku(sku: string): Promise<Product>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getLowStockProducts(): Promise<Product[]>;
}

export interface ProductCategoryRepository {
  findAll(): Promise<ProductCategory[]>;
  findById(id: string): Promise<ProductCategory | null>;
  create(category: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductCategory>;
  update(id: string, category: Partial<ProductCategory>): Promise<ProductCategory>;
  delete(id: string): Promise<void>;
}
