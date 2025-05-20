import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h2>Posts</h2>
      <div class="loading" *ngIf="loading">Loading posts...</div>
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <div class="posts-grid" *ngIf="posts.length > 0">
        @for (post of posts; track post.id) {
          <div class="post-card">
            <h3>{{ post.title }}</h3>
            <p>{{ post.body.substring(0, 100) }}...</p>
            <a [routerLink]="['/post', post.id]">Read more</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h2 {
      color: #333;
      margin-bottom: 20px;
    }
    
    .loading, .error {
      padding: 20px;
      text-align: center;
    }
    
    .error {
      color: #d9534f;
    }
    
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .post-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .post-card:hover {
      transform: translateY(-5px);
    }
    
    .post-card h3 {
      margin-top: 0;
      color: #333;
      font-size: 1.2rem;
    }
    
    .post-card a {
      display: inline-block;
      margin-top: 10px;
      color: #007bff;
      text-decoration: none;
    }
    
    .post-card a:hover {
      text-decoration: underline;
    }
  `
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading = false;
  error = '';

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load posts. Please try again later.';
        this.loading = false;
        console.error('Error fetching posts:', err);
      }
    });
  }
} 