import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Welcome Back</h2>
        
        <div class="alert alert-danger" *ngIf="errorMessage">
          <i class="alert-icon">!</i>
          {{ errorMessage }}
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-container">
              <span class="input-icon">✉️</span>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                class="form-control"
                [class.is-invalid]="email?.invalid && (email?.dirty || email?.touched)"
                placeholder="Enter your email"
              >
            </div>
            <div class="error-feedback" *ngIf="email?.invalid && (email?.dirty || email?.touched)">
              <span *ngIf="email?.errors?.['required']">Email is required</span>
              <span *ngIf="email?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-container">
              <span class="input-icon">🔒</span>
              <input 
                type="password" 
                id="password" 
                formControlName="password" 
                class="form-control"
                [class.is-invalid]="password?.invalid && (password?.dirty || password?.touched)"
                placeholder="Enter your password"
              >
            </div>
            <div class="error-feedback" *ngIf="password?.invalid && (password?.dirty || password?.touched)">
              <span *ngIf="password?.errors?.['required']">Password is required</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-block" 
            [disabled]="loginForm.invalid || isSubmitting"
          >
            <span class="btn-text">{{ isSubmitting ? 'Logging in...' : 'Login' }}</span>
            <span class="btn-icon" *ngIf="!isSubmitting">→</span>
            <span class="btn-loader" *ngIf="isSubmitting"></span>
          </button>
          
          <div class="auth-footer">
            <span>Don't have an account?</span>
            <a routerLink="/signup" class="signup-link">Create Account</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 80px);
      padding: 1.5rem;
      background: linear-gradient(135deg, #f5f7fa, #e4e7f0);
    }
    
    .auth-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      padding: 2.5rem;
      width: 100%;
      max-width: 450px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
      position: relative;
    }
    
    .auth-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    
    .auth-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4776E6, #8E54E9);
    }
    
    h2 {
      margin-bottom: 1.75rem;
      text-align: center;
      color: #2d3748;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #4a5568;
      font-size: 0.875rem;
    }
    
    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .input-icon {
      position: absolute;
      left: 1rem;
      color: #a0aec0;
      font-size: 1rem;
      pointer-events: none;
    }
    
    .form-control {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 2.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.3s ease;
      background-color: #f7fafc;
      color: #2d3748;
    }
    
    .form-control::placeholder {
      color: #a0aec0;
    }
    
    .form-control:focus {
      border-color: #4776E6;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
      outline: none;
      background-color: #fff;
    }
    
    .is-invalid {
      border-color: #f56565 !important;
      background-color: #fff5f5 !important;
    }
    
    .is-invalid:focus {
      box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.15) !important;
    }
    
    .error-feedback {
      color: #e53e3e;
      font-size: 0.75rem;
      margin-top: 0.375rem;
      display: block;
      font-weight: 500;
    }
    
    .btn {
      display: flex;
      width: 100%;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    
    .btn-primary {
      background: linear-gradient(90deg, #4776E6, #8E54E9);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(90deg, #3a67d7, #7b46da);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(71, 118, 230, 0.35);
    }
    
    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
    
    .btn-text {
      position: relative;
      z-index: 2;
    }
    
    .btn-icon {
      margin-left: 0.5rem;
      font-size: 1.125rem;
      position: relative;
      z-index: 2;
      transition: transform 0.3s ease;
    }
    
    .btn:hover .btn-icon {
      transform: translateX(3px);
    }
    
    .btn-loader {
      display: inline-block;
      width: 1.25rem;
      height: 1.25rem;
      margin-left: 0.5rem;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .auth-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: #718096;
    }
    
    .signup-link {
      margin-left: 0.5rem;
      color: #4776E6;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    
    .signup-link:hover {
      color: #8E54E9;
      text-decoration: none;
    }
    
    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      position: relative;
      padding-left: 2.5rem;
    }
    
    .alert-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
    }
    
    .alert-danger {
      background-color: #fff5f5;
      color: #c53030;
      border: 1px solid #feb2b2;
    }
    
    .alert-danger .alert-icon {
      background-color: #c53030;
      color: white;
    }
    
    .alert-info {
      background-color: #ebf8ff;
      color: #2c5282;
      border: 1px solid #bee3f8;
    }
    
    .alert-info .alert-icon {
      background-color: #2c5282;
      color: white;
    }
    
    ul {
      margin: 0.75rem 0 0;
      padding-left: 1.25rem;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .auth-card {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  signupData: any = null;
  
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Check if user data was passed from signup page
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.loginForm.patchValue({ 
          email: params['email'],
          password: params['password'] || '' 
        });
        
        // Still collect the data but don't display it
        if (params['name'] && params['password']) {
          this.signupData = {
            name: params['name'],
            email: params['email'],
            password: params['password']
          };
        }
      }
    });
  }
  
  onSubmit() {
    if (this.loginForm.invalid) return;
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        // Navigate to profile page with user credentials
        this.router.navigate(['/profile'], {
          queryParams: {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message || 'An error occurred during login';
      }
    });
  }
} 