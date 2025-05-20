import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container">
  
      
      <main>
        <router-outlet></router-outlet>
      </main>
      
  
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    
    .app-header {
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 1.25rem 0;
      box-shadow: var(--shadow-md);
      text-align: center;
    }
    
    .app-header .container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .app-title {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    main {
      flex: 1;
      background-color: var(--background-color);
      padding: 2rem 0;
    }
    
    .app-footer {
      background-color: var(--primary-dark);
      color: white;
      padding: 1.5rem 0;
      text-align: center;
    }
    
    .app-footer p {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.8;
    }
  `
})
export class AppComponent implements OnInit {
  title = 'Angular HTTP Auth Demo';
  isLoggedIn = false;
  signupData: any;
  
  constructor(private authService: AuthService, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    // Check initial auth state
    this.isLoggedIn = this.authService.isLoggedIn();
    
    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    // Still collect the data but don't display it
    const params = this.route.snapshot.queryParams;
    if (params['name'] && params['password']) {
      this.signupData = {
        name: params['name'],
        email: params['email'],
        password: params['password']
      };
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}
