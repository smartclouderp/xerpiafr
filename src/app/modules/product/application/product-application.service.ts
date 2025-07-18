import { Injectable } from '@angular/core';
import { ProductInfrastructureService } from '../infrastructure/product-infrastructure.service';
import { Product, CreateProductRequest, UpdateProductRequest, ProductCategory } from '../../../shared/models/product.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductApplicationService {
  constructor(private productInfrastructure: ProductInfrastructureService) {}

  // Product use cases
  getAllProducts(params?: any): Observable<Product[]> {
    return this.productInfrastructure.findAll(params).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  getProductById(id: string): Observable<Product | null> {
    if (!id) {
      return throwError(() => new Error('Product ID is required'));
    }

    return this.productInfrastructure.findById(id).pipe(
      catchError(error => {
        console.error('Error fetching product:', error);
        return throwError(() => new Error('Failed to fetch product'));
      })
    );
  }

  createProduct(productData: CreateProductRequest): Observable<Product> {
    if (!this.validateProductData(productData)) {
      return throwError(() => new Error('Invalid product data'));
    }

    return this.productInfrastructure.create(productData).pipe(
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(() => new Error('Failed to create product'));
      })
    );
  }

  updateProduct(id: string, productData: UpdateProductRequest): Observable<Product> {
    if (!id) {
      return throwError(() => new Error('Product ID is required'));
    }

    return this.productInfrastructure.update(id, productData).pipe(
      catchError(error => {
        console.error('Error updating product:', error);
        return throwError(() => new Error('Failed to update product'));
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('Product ID is required'));
    }

    return this.productInfrastructure.deleteProduct(id).pipe(
      catchError(error => {
        console.error('Error deleting product:', error);
        return throwError(() => new Error('Failed to delete product'));
      })
    );
  }

  getProductBySku(sku: string): Observable<Product | null> {
    if (!sku) {
      return throwError(() => new Error('SKU is required'));
    }

    return this.productInfrastructure.findBySku(sku).pipe(
      catchError(error => {
        console.error('Error fetching product by SKU:', error);
        return throwError(() => new Error('Failed to fetch product by SKU'));
      })
    );
  }

  getProductsByCategory(categoryId: string, params?: any): Observable<Product[]> {
    if (!categoryId) {
      return throwError(() => new Error('Category ID is required'));
    }

    return this.productInfrastructure.findByCategory(categoryId, params).pipe(
      catchError(error => {
        console.error('Error fetching products by category:', error);
        return throwError(() => new Error('Failed to fetch products by category'));
      })
    );
  }

  getLowStockProducts(params?: any): Observable<Product[]> {
    return this.productInfrastructure.findLowStock(params).pipe(
      catchError(error => {
        console.error('Error fetching low stock products:', error);
        return throwError(() => new Error('Failed to fetch low stock products'));
      })
    );
  }

  searchProducts(query: string, params?: any): Observable<Product[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Search query must be at least 2 characters'));
    }

    return this.productInfrastructure.search(query.trim(), params).pipe(
      catchError(error => {
        console.error('Error searching products:', error);
        return throwError(() => new Error('Failed to search products'));
      })
    );
  }

  updateStock(id: string, stock: number): Observable<Product> {
    if (!id) {
      return throwError(() => new Error('Product ID is required'));
    }

    if (stock < 0) {
      return throwError(() => new Error('Stock cannot be negative'));
    }

    return this.productInfrastructure.updateStock(id, stock).pipe(
      catchError(error => {
        console.error('Error updating stock:', error);
        return throwError(() => new Error('Failed to update stock'));
      })
    );
  }

  // Category use cases
  getAllCategories(): Observable<ProductCategory[]> {
    return this.productInfrastructure.findAllCategories().pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(() => new Error('Failed to fetch categories'));
      })
    );
  }

  getCategoryById(id: string): Observable<ProductCategory | null> {
    if (!id) {
      return throwError(() => new Error('Category ID is required'));
    }

    return this.productInfrastructure.findCategoryById(id).pipe(
      catchError(error => {
        console.error('Error fetching category:', error);
        return throwError(() => new Error('Failed to fetch category'));
      })
    );
  }

  createCategory(categoryData: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>): Observable<ProductCategory> {
    if (!categoryData.name?.trim()) {
      return throwError(() => new Error('Category name is required'));
    }

    return this.productInfrastructure.createCategory(categoryData).pipe(
      catchError(error => {
        console.error('Error creating category:', error);
        return throwError(() => new Error('Failed to create category'));
      })
    );
  }

  updateCategory(id: string, categoryData: Partial<ProductCategory>): Observable<ProductCategory> {
    if (!id) {
      return throwError(() => new Error('Category ID is required'));
    }

    return this.productInfrastructure.updateCategory(id, categoryData).pipe(
      catchError(error => {
        console.error('Error updating category:', error);
        return throwError(() => new Error('Failed to update category'));
      })
    );
  }

  deleteCategory(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('Category ID is required'));
    }

    return this.productInfrastructure.deleteCategory(id).pipe(
      catchError(error => {
        console.error('Error deleting category:', error);
        return throwError(() => new Error('Failed to delete category'));
      })
    );
  }

  private validateProductData(productData: CreateProductRequest): boolean {
    return !!(
      productData.name?.trim() &&
      productData.description?.trim() &&
      productData.sku?.trim() &&
      productData.price >= 0 &&
      productData.cost >= 0 &&
      productData.stock >= 0 &&
      productData.minStock >= 0 &&
      productData.categoryId?.trim()
    );
  }
}
