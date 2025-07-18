import { Injectable } from '@angular/core';
import { UserInfrastructureService } from '../infrastructure/user-infrastructure.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../../../shared/models/user.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserApplicationService {
  constructor(private userInfrastructure: UserInfrastructureService) {}

  getAllUsers(params?: any): Observable<User[]> {
    return this.userInfrastructure.findAll(params).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  getUserById(id: string): Observable<User | null> {
    if (!id) {
      return throwError(() => new Error('User ID is required'));
    }

    return this.userInfrastructure.findById(id).pipe(
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('Failed to fetch user'));
      })
    );
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    if (!this.validateUserData(userData)) {
      return throwError(() => new Error('Invalid user data'));
    }

    return this.userInfrastructure.create(userData).pipe(
      catchError(error => {
        console.error('Error creating user:', error);
        return throwError(() => new Error('Failed to create user'));
      })
    );
  }

  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    if (!id) {
      return throwError(() => new Error('User ID is required'));
    }

    return this.userInfrastructure.update(id, userData).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => new Error('Failed to update user'));
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('User ID is required'));
    }

    return this.userInfrastructure.deleteUser(id).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error('Failed to delete user'));
      })
    );
  }

  getUserByEmail(email: string): Observable<User | null> {
    if (!email || !this.isValidEmail(email)) {
      return throwError(() => new Error('Valid email is required'));
    }

    return this.userInfrastructure.findByEmail(email).pipe(
      catchError(error => {
        console.error('Error fetching user by email:', error);
        return throwError(() => new Error('Failed to fetch user by email'));
      })
    );
  }

  searchUsers(query: string, params?: any): Observable<User[]> {
    if (!query || query.trim().length < 2) {
      return throwError(() => new Error('Search query must be at least 2 characters'));
    }

    return this.userInfrastructure.search(query.trim(), params).pipe(
      catchError(error => {
        console.error('Error searching users:', error);
        return throwError(() => new Error('Failed to search users'));
      })
    );
  }

  updateUserStatus(id: string, isActive: boolean): Observable<User> {
    if (!id) {
      return throwError(() => new Error('User ID is required'));
    }

    return this.userInfrastructure.updateStatus(id, isActive).pipe(
      catchError(error => {
        console.error('Error updating user status:', error);
        return throwError(() => new Error('Failed to update user status'));
      })
    );
  }

  private validateUserData(userData: CreateUserRequest): boolean {
    return !!(
      userData.email &&
      userData.username &&
      userData.password &&
      userData.firstName &&
      userData.lastName &&
      userData.role &&
      this.isValidEmail(userData.email)
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
