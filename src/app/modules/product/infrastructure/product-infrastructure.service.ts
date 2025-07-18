import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpService, PaginationParams } from '../../../shared/services/base-http.service';
import { Product, CreateProductRequest, UpdateProductRequest, ProductCategory } from '../../../shared/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductInfrastructureService extends BaseHttpService {
  private readonly endpoint = '/products';
  private readonly categoriesEndpoint = '/product-categories';

  // Product methods
  findAll(paginationParams?: PaginationParams): Observable<Product[]> {
    return this.getPaginated<Product>(this.endpoint, paginationParams)
      .pipe(map(response => response.data || []));
  }

  findById(id: string): Observable<Product | null> {
    return this.get<Product>(`${this.endpoint}/${id}`)
      .pipe(map(response => response.data || null));
  }

  create(productData: CreateProductRequest): Observable<Product> {
    return this.post<CreateProductRequest, Product>(this.endpoint, productData)
      .pipe(map(response => response.data!));
  }

  update(id: string, productData: UpdateProductRequest): Observable<Product> {
    return this.put<UpdateProductRequest, Product>(`${this.endpoint}/${id}`, productData)
      .pipe(map(response => response.data!));
  }

  deleteProduct(id: string): Observable<void> {
    return super.delete(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }

  findBySku(sku: string): Observable<Product | null> {
    return this.get<Product>(`${this.endpoint}/sku/${sku}`)
      .pipe(map(response => response.data || null));
  }

  findByCategory(categoryId: string, paginationParams?: PaginationParams): Observable<Product[]> {
    return this.getPaginated<Product>(`${this.endpoint}/category/${categoryId}`, paginationParams)
      .pipe(map(response => response.data || []));
  }

  findLowStock(paginationParams?: PaginationParams): Observable<Product[]> {
    return this.getPaginated<Product>(`${this.endpoint}/low-stock`, paginationParams)
      .pipe(map(response => response.data || []));
  }

  search(query: string, paginationParams?: PaginationParams): Observable<Product[]> {
    const params = { query, ...paginationParams };
    return this.getPaginated<Product>(`${this.endpoint}/search`, undefined, params)
      .pipe(map(response => response.data || []));
  }

  updateStock(id: string, stock: number): Observable<Product> {
    return this.patch<{ stock: number }, Product>(`${this.endpoint}/${id}/stock`, { stock })
      .pipe(map(response => response.data!));
  }

  // Category methods
  findAllCategories(): Observable<ProductCategory[]> {
    return this.get<ProductCategory[]>(this.categoriesEndpoint)
      .pipe(map(response => response.data || []));
  }

  findCategoryById(id: string): Observable<ProductCategory | null> {
    return this.get<ProductCategory>(`${this.categoriesEndpoint}/${id}`)
      .pipe(map(response => response.data || null));
  }

  createCategory(categoryData: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>): Observable<ProductCategory> {
    return this.post<typeof categoryData, ProductCategory>(this.categoriesEndpoint, categoryData)
      .pipe(map(response => response.data!));
  }

  updateCategory(id: string, categoryData: Partial<ProductCategory>): Observable<ProductCategory> {
    return this.put<Partial<ProductCategory>, ProductCategory>(`${this.categoriesEndpoint}/${id}`, categoryData)
      .pipe(map(response => response.data!));
  }

  deleteCategory(id: string): Observable<void> {
    return super.delete(`${this.categoriesEndpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
