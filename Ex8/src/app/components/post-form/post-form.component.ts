import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <a routerLink="/" class="back-link">← Back to Posts</a>
      
      <h2>Create New Post</h2>
      
      <div class="success-message" *ngIf="successMessage">
        {{ successMessage }}
      </div>
      
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
      
      <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="post-form">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title" 
            formControlName="title" 
            class="form-control"
            [class.is-invalid]="title?.invalid && title?.touched"
          >
          <div class="error-feedback" *ngIf="title?.invalid && title?.touched">
            <span *ngIf="title?.errors?.['required']">Title is required</span>
            <span *ngIf="title?.errors?.['minlength']">Title must be at least 3 characters</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="body">Content</label>
          <textarea 
            id="body" 
            formControlName="body" 
            class="form-control"
            rows="6"
            [class.is-invalid]="body?.invalid && body?.touched"
          ></textarea>
          <div class="error-feedback" *ngIf="body?.invalid && body?.touched">
            <span *ngIf="body?.errors?.['required']">Content is required</span>
            <span *ngIf="body?.errors?.['minlength']">Content must be at least 10 characters</span>
          </div>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn-submit" 
            [disabled]="postForm.invalid || isSubmitting"
          >
            {{ isSubmitting ? 'Creating...' : 'Create Post' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      color: #007bff;
      text-decoration: none;
    }
    
    .back-link:hover {
      text-decoration: underline;
    }
    
    h2 {
      margin-bottom: 20px;
      color: #333;
    }
    
    .post-form {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      transition: border-color 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.25);
    }
    
    .is-invalid {
      border-color: #dc3545;
    }
    
    .error-feedback {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .form-actions {
      margin-top: 30px;
    }
    
    .btn-submit {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .btn-submit:hover:not(:disabled) {
      background-color: #0069d9;
    }
    
    .btn-submit:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .success-message {
      background-color: #d4edda;
      color: #155724;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
  `
})
export class PostFormComponent {
  postForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  
  get title() { return this.postForm.get('title'); }
  get body() { return this.postForm.get('body'); }
  
  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      userId: [1] // Using a default userId for simplicity
    });
  }
  
  onSubmit(): void {
    if (this.postForm.invalid) return;
    
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    this.postService.createPost(this.postForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = `Post created successfully with ID: ${response.id}`;
        this.postForm.reset({ userId: 1 });
        
        // Navigate back to posts list after a short delay
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create post. Please try again.';
        console.error('Error creating post:', err);
      }
    });
  }
} 