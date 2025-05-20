import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, LoginResponse, LoginRequest } from '../models/user.model';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private usersKey = 'auth_users';
  private isBrowser: boolean;
  
  currentUser$ = this.currentUserSubject.asObservable();
  token$ = this.tokenSubject.asObservable();
  
  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  
    if (this.isBrowser) {
      this.loadStoredAuth();
    }
  }
  
  loadStoredAuth(): void {
    if (!this.isBrowser) return;
    
    const storedUser = localStorage.getItem('current_user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.tokenSubject.next(storedToken);
    }
  }
 
  private getStoredUsers(): User[] {
    if (!this.isBrowser) return [];
    
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }
  
  private storeUser(user: User): void {
    if (!this.isBrowser) return;
    
    const users = this.getStoredUsers();
    // Add id to the user
    user.id = users.length + 1;
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }
  
  signup(user: User): Observable<User> {
    // Check if email already exists
    const existingUsers = this.getStoredUsers();
    const emailExists = existingUsers.some(u => u.email === user.email);
    
    if (emailExists) {
      return throwError(() => new Error('Email already in use'));
    }
    
    // Store the user
    this.storeUser(user);
    
    // For signup, return the complete user data including password
    // NOTE: This is just for demo purposes - never return passwords in a real app!
    return of(user);
  }
  
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Find user with matching email and password
    const users = this.getStoredUsers();
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );
    
    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }
    
    // Generate a fake token
    const token = `token_${Math.random().toString(36).substring(2, 15)}`;
    
    if (this.isBrowser) {
      // Store in localStorage for persistence (only in browser)
      localStorage.setItem('current_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
    }
    
    // Update behavior subjects
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
    
    return of({
      user,
      token
    });
  }
  
  logout(): void {
    if (this.isBrowser) {
      // Remove user from localStorage (only in browser)
      localStorage.removeItem('current_user');
      localStorage.removeItem('auth_token');
    }
    
    // Update behavior subjects
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }
  
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 