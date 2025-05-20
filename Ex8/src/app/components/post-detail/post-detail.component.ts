import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <a routerLink="/" class="back-link">← Back to Posts</a>
      
      <div class="loading" *ngIf="loading">Loading post details...</div>
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <div class="post-detail" *ngIf="post">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">Post ID: {{ post.id }} | User ID: {{ post.userId }}</div>
        <div class="post-body">
          <p>{{ post.body }}</p>
        </div>
      </div>
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
    
    .loading, .error {
      padding: 20px;
      text-align: center;
    }
    
    .error {
      color: #d9534f;
    }
    
    .post-detail {
      background: white;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    
    .post-detail h1 {
      margin-top: 0;
      color: #333;
    }
    
    .post-meta {
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 20px;
    }
    
    .post-body {
      line-height: 1.6;
    }
  `
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  loading = false;
  error = '';
  
  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}
  
  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.postService.getPost(+id).subscribe({
        next: (post) => {
          this.post = post;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load post details. Please try again later.';
          this.loading = false;
          console.error('Error fetching post:', err);
        }
      });
    } else {
      this.error = 'Post ID not found';
      this.loading = false;
    }
  }
} 