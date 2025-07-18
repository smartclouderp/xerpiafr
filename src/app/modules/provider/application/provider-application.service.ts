import { Injectable } from '@angular/core';
import { ProviderInfrastructureService } from '../infrastructure/provider-infrastructure.service';
import { Provider, CreateProviderRequest, UpdateProviderRequest } from '../../../shared/models/provider.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProviderApplicationService {
  constructor(private providerInfrastructure: ProviderInfrastructureService) {}

  getAllProviders(params?: any): Observable<Provider[]> {
    return this.providerInfrastructure.findAll(params).pipe(
      catchError(error => {
        console.error('Error fetching providers:', error);
        return throwError(() => new Error('Failed to fetch providers'));
      })
    );
  }

  getProviderById(id: string): Observable<Provider | null> {
    if (!id) {
      return throwError(() => new Error('Provider ID is required'));
    }

    return this.providerInfrastructure.findById(id).pipe(
      catchError(error => {
        console.error('Error fetching provider:', error);
        return throwError(() => new Error('Failed to fetch provider'));
      })
    );
  }

  createProvider(providerData: CreateProviderRequest): Observable<Provider> {
    if (!this.validateProviderData(providerData)) {
      return throwError(() => new Error('Invalid provider data'));
    }

    return this.providerInfrastructure.create(providerData).pipe(
      catchError(error => {
        console.error('Error creating provider:', error);
        return throwError(() => new Error('Failed to create provider'));
      })
    );
  }

  updateProvider(id: string, providerData: UpdateProviderRequest): Observable<Provider> {
    if (!id) {
      return throwError(() => new Error('Provider ID is required'));
    }

    return this.providerInfrastructure.update(id, providerData).pipe(
      catchError(error => {
        console.error('Error updating provider:', error);
        return throwError(() => new Error('Failed to update provider'));
      })
    );
  }

  deleteProvider(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('Provider ID is required'));
    }

    return this.providerInfrastructure.deleteProvider(id).pipe(
      catchError(error => {
        console.error('Error deleting provider:', error);
        return throwError(() => new Error('Failed to delete provider'));
      })
    );
  }

  getProviderByTaxId(taxId: string): Observable<Provider | null> {
    if (!taxId) {
      return throwError(() => new Error('Tax ID is required'));
    }

    return this.providerInfrastructure.findByTaxId(taxId).pipe(
      catchError(error => {
        console.error('Error fetching provider by tax ID:', error);
        return throwError(() => new Error('Failed to fetch provider by tax ID'));
      })
    );
  }

  getProviderByEmail(email: string): Observable<Provider | null> {
    if (!email || !this.isValidEmail(email)) {
      return throwError(() => new Error('Valid email is required'));
    }

    return this.providerInfrastructure.findByEmail(email).pipe(
      catchError(error => {
        console.error('Error fetching provider by email:', error);
        return throwError(() => new Error('Failed to fetch provider by email'));
      })
    );
  }

  searchProviders(query: string, params?: any): Observable<Provider[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Search query must be at least 2 characters'));
    }

    return this.providerInfrastructure.search(query.trim(), params).pipe(
      catchError(error => {
        console.error('Error searching providers:', error);
        return throwError(() => new Error('Failed to search providers'));
      })
    );
  }

  updateProviderStatus(id: string, isActive: boolean): Observable<Provider> {
    if (!id) {
      return throwError(() => new Error('Provider ID is required'));
    }

    return this.providerInfrastructure.updateStatus(id, isActive).pipe(
      catchError(error => {
        console.error('Error updating provider status:', error);
        return throwError(() => new Error('Failed to update provider status'));
      })
    );
  }

  getProvidersByLocation(country?: string, state?: string, city?: string): Observable<Provider[]> {
    return this.providerInfrastructure.getProvidersByLocation(country, state, city).pipe(
      catchError(error => {
        console.error('Error fetching providers by location:', error);
        return throwError(() => new Error('Failed to fetch providers by location'));
      })
    );
  }

  private validateProviderData(providerData: CreateProviderRequest): boolean {
    return !!(
      providerData.name?.trim() &&
      providerData.email?.trim() &&
      providerData.phone?.trim() &&
      providerData.taxId?.trim() &&
      providerData.contactPerson?.trim() &&
      providerData.address &&
      this.isValidEmail(providerData.email) &&
      this.validateAddress(providerData.address)
    );
  }

  private validateAddress(address: any): boolean {
    return !!(
      address.street?.trim() &&
      address.city?.trim() &&
      address.state?.trim() &&
      address.zipCode?.trim() &&
      address.country?.trim()
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
