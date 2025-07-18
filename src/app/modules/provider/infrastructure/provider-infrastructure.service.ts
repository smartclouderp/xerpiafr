import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpService, PaginationParams } from '../../../shared/services/base-http.service';
import { Provider, CreateProviderRequest, UpdateProviderRequest } from '../../../shared/models/provider.interface';

@Injectable({
  providedIn: 'root'
})
export class ProviderInfrastructureService extends BaseHttpService {
  private readonly endpoint = '/providers';

  findAll(paginationParams?: PaginationParams): Observable<Provider[]> {
    return this.getPaginated<Provider>(this.endpoint, paginationParams)
      .pipe(map(response => response.data || []));
  }

  findById(id: string): Observable<Provider | null> {
    return this.get<Provider>(`${this.endpoint}/${id}`)
      .pipe(map(response => response.data || null));
  }

  create(providerData: CreateProviderRequest): Observable<Provider> {
    return this.post<CreateProviderRequest, Provider>(this.endpoint, providerData)
      .pipe(map(response => response.data!));
  }

  update(id: string, providerData: UpdateProviderRequest): Observable<Provider> {
    return this.put<UpdateProviderRequest, Provider>(`${this.endpoint}/${id}`, providerData)
      .pipe(map(response => response.data!));
  }

  deleteProvider(id: string): Observable<void> {
    return super.delete(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }

  findByTaxId(taxId: string): Observable<Provider | null> {
    return this.get<Provider>(`${this.endpoint}/tax-id/${taxId}`)
      .pipe(map(response => response.data || null));
  }

  findByEmail(email: string): Observable<Provider | null> {
    return this.get<Provider>(`${this.endpoint}/email/${email}`)
      .pipe(map(response => response.data || null));
  }

  search(query: string, paginationParams?: PaginationParams): Observable<Provider[]> {
    const params = { query, ...paginationParams };
    return this.getPaginated<Provider>(`${this.endpoint}/search`, undefined, params)
      .pipe(map(response => response.data || []));
  }

  updateStatus(id: string, isActive: boolean): Observable<Provider> {
    return this.patch<{ isActive: boolean }, Provider>(`${this.endpoint}/${id}/status`, { isActive })
      .pipe(map(response => response.data!));
  }

  getProvidersByLocation(country?: string, state?: string, city?: string): Observable<Provider[]> {
    const params: any = {};
    if (country) params.country = country;
    if (state) params.state = state;
    if (city) params.city = city;

    return this.getPaginated<Provider>(`${this.endpoint}/location`, undefined, params)
      .pipe(map(response => response.data || []));
  }
}
