import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.interface';

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  protected readonly baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected get<T>(endpoint: string, params?: QueryParams): Observable<ApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      params: httpParams,
      headers: this.getDefaultHeaders()
    });
  }

  protected getPaginated<T>(
    endpoint: string,
    paginationParams?: PaginationParams,
    additionalParams?: QueryParams
  ): Observable<PaginatedResponse<T>> {
    const allParams = { ...paginationParams, ...additionalParams };
    const httpParams = this.buildHttpParams(allParams);
    
    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}${endpoint}`, {
      params: httpParams,
      headers: this.getDefaultHeaders()
    });
  }

  protected post<T, R = any>(endpoint: string, data: T): Observable<ApiResponse<R>> {
    return this.http.post<ApiResponse<R>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getDefaultHeaders()
    });
  }

  protected put<T, R = any>(endpoint: string, data: T): Observable<ApiResponse<R>> {
    return this.http.put<ApiResponse<R>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getDefaultHeaders()
    });
  }

  protected patch<T, R = any>(endpoint: string, data: T): Observable<ApiResponse<R>> {
    return this.http.patch<ApiResponse<R>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getDefaultHeaders()
    });
  }

  protected delete<T = any>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getDefaultHeaders()
    });
  }

  private getDefaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private buildHttpParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    
    return httpParams;
  }
}
