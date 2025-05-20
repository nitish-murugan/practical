import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2>User Credentials</h2>
        
        <div class="credentials-box">
          <div class="credential-item">
            <span class="label">Email:</span>
            <span class="value">{{ userEmail }}</span>
          </div>
          
          <div class="credential-item">
            <span class="label">Password:</span>
            <span class="value">{{ userPassword }}</span>
          </div>
        </div>
        
        <button class="btn-logout" (click)="logout()">Logout</button>
      </div>
    </div>
  `,
  styles: `
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 1.5rem;
      background: linear-gradient(135deg, #f5f7fa, #e4e7f0);
    }
    
    .profile-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      padding: 2.5rem;
      width: 100%;
      max-width: 500px;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .profile-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    
    .profile-card::before {
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
      color: #2d3748;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      position: relative;
      display: inline-block;
    }
    
    h2::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #4776E6, #8E54E9);
      border-radius: 3px;
    }
    
    .credentials-box {
      background-color: #f7fafc;
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(71, 118, 230, 0.1);
      box-shadow: 0 2px 5px rgba(0,0,0,0.03);
    }
    
    .credential-item {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid rgba(71, 118, 230, 0.1);
      transition: all 0.3s ease;
      align-items: center;
    }
    
    .credential-item:hover {
      background-color: rgba(71, 118, 230, 0.03);
    }
    
    .credential-item:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 600;
      color: #4a5568;
      display: flex;
      align-items: center;
    }
    
    .label::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: #4776E6;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    
    .value {
      font-family: 'Courier New', monospace;
      font-size: 1rem;
      color: #4776E6;
      padding: 0.25rem 0.75rem;
      background-color: rgba(71, 118, 230, 0.1);
      border-radius: 0.25rem;
      font-weight: 500;
    }
    
    .btn-logout {
      background: linear-gradient(90deg, #f56565, #e53e3e);
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-logout::before {
      content: '↩';
      margin-right: 0.5rem;
      font-weight: bold;
    }
    
    .btn-logout:hover {
      background: linear-gradient(90deg, #e53e3e, #c53030);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(229, 62, 62, 0.25);
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .profile-card {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .credential-item:nth-child(1) {
      animation: fadeInUp 0.5s 0.1s ease-out both;
    }
    
    .credential-item:nth-child(2) {
      animation: fadeInUp 0.5s 0.2s ease-out both;
    }
  `
})
export class ProfileComponent implements OnInit {
  userEmail: string = '';
  userPassword: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    // Get the credentials from URL parameters
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.userEmail = params['email'];
      }
      
      if (params['password']) {
        this.userPassword = params['password'];
      }
    });
    
    // If no credentials in URL, try to get from the auth service
    if (!this.userEmail || !this.userPassword) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userEmail = user.email;
        this.userPassword = user.password;
      } else {
        // If no user data available, navigate to login
        this.router.navigate(['/login']);
      }
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
} 