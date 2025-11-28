# Ronin-Feed-app
A modern, full-stack social media application inspired by Instagram, built with React, TypeScript, and Lovable Cloud.

## Features

- User Authentication: Sign up and login with email
- Create Posts: Upload images with captions
- Feed: Browse posts from users you follow
- Like Posts: Double-tap or click to like posts
- Follow System: Follow and unfollow other users
- User Profiles: View user profiles with their posts, followers, and following count
- Responsive Design: Beautiful UI that works on all devices
- Real-time Updates: Instant feed updates when new posts are created

## Tech Stack

Frontend:
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router for navigation
- TanStack Query for data fetching
- Lucide React for icons

Backend:
- Supabase
- PostgreSQL database
- Row Level Security (RLS) policies
- Storage buckets for images
- Authentication system

Design System:
- Custom fonts: Playfair Display (display) & Inter (body)
- Modern minimalist aesthetic with Japanese influences
- Semantic color tokens for consistent theming

## Getting Started

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
  bash
git clone <YOUR_GIT_URL>
cd ronin

2. Install dependencies:
  bash
npm install

3. Start the development server:
  bash
npm run dev


4. Open your browser and navigate to `http://localhost:8080`

## 📁 Project Structure

```
ronin/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Navigation.tsx
│   │   ├── CreatePost.tsx
│   │   ├── PostCard.tsx
│   │   └── NavLink.tsx
│   ├── pages/            # Page components
│   │   ├── Auth.tsx      # Login/signup page
│   │   ├── Feed.tsx      # Main feed
│   │   ├── Profile.tsx   # User profile
│   │   └── NotFound.tsx
│   ├── integrations/     # Backend integration
│   │   └── supabase/     # Supabase client & types
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── index.css         # Global styles & design tokens
├── supabase/             # Database migrations
└── public/               # Static assets
```

## Database Schema

profiles: User profiles with username, bio, avatar
posts: User posts with images and captions
likes: Post likes tracking
follows: User follow relationships

## Design System

The app uses a semantic design system with CSS variables defined in `index.css`:

- primary: Main brand color
- secondary: Secondary UI elements
- accent: Accent colors for highlights
- background: Page backgrounds
- foreground: Text colors
- Custom gradients and shadows

## Authentication

The app uses email-based authentication with auto-confirmed signups. Users must create an account to:
- Create posts
- Like posts
- Follow other users
- View their profile

## Usage

1. Sign Up: Create an account with email and username
2. Create Posts: Click the "+" button to upload an image with a caption
3. Browse Feed: View posts from users you follow
4. Like Posts: Click the heart icon or double-tap on mobile
5. Follow Users: Click on usernames to view profiles and follow them
6. Profile: View your posts and edit your profile

##ScreenShots
<img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/9e322f96-f894-435e-823f-4e5a6a98d1cb" />
<img width="1897" height="870" alt="image" src="https://github.com/user-attachments/assets/e40e9388-561a-4ccf-a361-e62824597e53" />

