# Social Media Feed

A modern, Instagram-inspired social media feed application built with React and Supabase.

## Features

### User Features
- **Authentication** - Email/password signup and login
- **Profile Management** - Customizable profile with avatar and cover image
- **Create Posts** - Share photos and videos with captions
- **Multiple Media** - Upload multiple images/videos per post
- **Video Auto-Play** - Videos automatically play when scrolling into view
- **Like Posts** - Like and unlike posts with real-time updates
- **Infinite Scroll** - Seamless feed loading as you scroll

### Technical Features
- **Real-time Updates** - Optimistic UI updates for instant feedback
- **Row Level Security** - Secure database access with Supabase RLS
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **State Management** - Zustand for efficient global state
- **Image Storage** - Supabase Storage for media files
- **Auto-play Videos** - Intersection Observer API for viewport detection

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Zustand** - State management

### Backend
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Storage
  - Row Level Security

### Key Libraries
- `@supabase/supabase-js` - Supabase client
- `react-intersection-observer` - Video auto-play
- `react-router-dom` - Routing
- `zustand` - State management
- `lucide-react` - Icons

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier works)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd TheAlterOffice

# Install dependencies
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `database-schema.sql`
4. Paste and run it in the SQL Editor
5. This will create:
   - All database tables (profiles, posts, post_images, likes, comments)
   - Row Level Security policies
   - Storage buckets (post-images, profile-images)
   - Triggers and indexes

### 3. Configure Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project settings under **API**.

### 4. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Project Structure

```
TheAlterOffice/
├── src/
│   ├── components/          # React components
│   │   ├── AuthPage.jsx     # Login/Signup page
│   │   ├── CreatePost.jsx   # Create post modal
│   │   ├── Feed.jsx         # Main feed view
│   │   ├── LoadingSpinner.jsx
│   │   ├── PostCard.jsx     # Individual post component
│   │   └── VideoPlayer.jsx  # Video player component
│   ├── pages/               # Route pages
│   │   └── ProfilePage.jsx  # User profile page
│   ├── store/               # Zustand stores
│   │   ├── authStore.js     # Authentication state
│   │   └── postsStore.js    # Posts state
│   ├── config/
│   │   └── supabase.js      # Supabase client config
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── database-schema.sql      # Complete database schema
├── package.json
└── README.md
```

## Database Schema

### Tables

**profiles**
- User profile information
- Links to auth.users
- Contains avatar, cover image, bio, etc.

**posts**
- User posts with content
- References author from profiles

**post_images**
- Multiple images/videos per post
- Ordered with `order_index`

**likes**
- Post likes with user-post uniqueness
- Optimized with indexes

**comments**
- Post comments (ready for future feature)

### Storage Buckets

**post-images**
- Stores post photos and videos
- Public access for viewing

**profile-images**
- Stores user avatars and cover images
- Public access for viewing

## Key Features Explained

### Video Auto-Play
Videos in the feed automatically play when they enter the viewport (50% visible) and pause when they exit. This creates a dynamic, engaging experience similar to Instagram and TikTok.

- Uses Intersection Observer API
- 50% visibility threshold
- Muted by default for browser compatibility
- Supports .mp4, .mov, .webm, .m4v formats

### Like System
Full like/unlike functionality with:
- Optimistic UI updates
- Real-time like counts
- Persistent storage in database
- Unique constraint (one like per user per post)

### Profile Images
Users can upload:
- Profile picture (avatar)
- Cover image
- Both stored in Supabase Storage
- Instant preview after upload

### Multiple Images per Post
- Upload multiple photos/videos per post
- Swipe/navigate between images
- Ordered display with dots indicator
- Delete individual images during creation

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style
- React functional components with hooks
- Tailwind CSS for styling
- Zustand for state management
- Async/await for API calls
- Optimistic UI updates

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Your Supabase anonymous key
```

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only modify their own data
- Public read access for posts and profiles
- Authenticated upload for images
- Secure token-based authentication

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Database Issues
- Ensure you've run `database-schema.sql` in Supabase
- Check RLS policies are enabled
- Verify storage buckets are created and public

### Upload Issues
- Check Supabase storage bucket permissions
- Verify environment variables are set correctly
- Ensure you're authenticated when uploading

### Video Issues
- Videos must be in supported formats (.mp4, .mov, .webm, .m4v)
- Auto-play requires videos to be muted
- Check browser auto-play policies

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
