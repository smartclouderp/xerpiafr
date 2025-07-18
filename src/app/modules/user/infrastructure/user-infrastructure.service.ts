import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpService, PaginationParams } from '../../../shared/services/base-http.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../../../shared/models/user.interface';
import { ApiResponse, PaginatedResponse } from '../../../shared/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserInfrastructureService extends BaseHttpService {
  private readonly endpoint = '/users';

  findAll(paginationParams?: PaginationParams): Observable<User[]> {
    return this.getPaginated<User>(this.endpoint, paginationParams)
      .pipe(map(response => response.data || []));
  }

  findById(id: string): Observable<User | null> {
    return this.get<User>(`${this.endpoint}/${id}`)
      .pipe(map(response => response.data || null));
  }

  create(userData: CreateUserRequest): Observable<User> {
    return this.post<CreateUserRequest, User>(this.endpoint, userData)
      .pipe(map(response => response.data!));
  }

  update(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.put<UpdateUserRequest, User>(`${this.endpoint}/${id}`, userData)
      .pipe(map(response => response.data!));
  }

  deleteUser(id: string): Observable<void> {
    return super.delete(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }

  findByEmail(email: string): Observable<User | null> {
    return this.get<User>(`${this.endpoint}/email/${email}`)
      .pipe(map(response => response.data || null));
  }

  search(query: string, paginationParams?: PaginationParams): Observable<User[]> {
    const params = { query, ...paginationParams };
    return this.getPaginated<User>(`${this.endpoint}/search`, undefined, params)
      .pipe(map(response => response.data || []));
  }

  updateStatus(id: string, isActive: boolean): Observable<User> {
    return this.patch<{ isActive: boolean }, User>(`${this.endpoint}/${id}/status`, { isActive })
      .pipe(map(response => response.data!));
  }
}
