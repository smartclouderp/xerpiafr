import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginTestService {
  constructor(private http: HttpClient) {}

  async testLogin() {
    const credentials = {
      username: 'admin',
      password: '123456'
    };

    try {
      console.log('Testing login with:', credentials);
      console.log('Endpoint:', 'http://localhost/xerpia/public/login');
      
      const response = await this.http.post('http://localhost/xerpia/public/login', credentials).toPromise();
      console.log('Login successful:', response);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
}
