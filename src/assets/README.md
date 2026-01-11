# Assets Folder Structure

This folder contains **static design assets** for the Social Media Feed app UI only. User-generated content (posts, stories, avatars) is handled through Firebase/Supabase storage.

## Folder Structure

```
src/assets/
├── icons/                # App icons, logos, and UI icons
├── illustrations/        # Design illustrations and graphics
├── ui/                   # UI elements like buttons, patterns
├── branding/            # Logo variations, brand elements
├── index.js             # Main assets export file
└── README.md            # This file
```

## What Goes Here vs Firebase

### ✅ **Assets Folder (Static Design Elements):**
- App logo and branding
- UI icons and graphics
- Illustrations and design elements
- Button graphics and patterns
- Loading animations
- Empty state illustrations
- Onboarding graphics

### 🚫 **Firebase Storage (User Content):**
- User profile pictures/avatars
- Post images and videos
- Story content
- User-uploaded media
- Dynamic backgrounds chosen by users

## How to Use

### 1. Adding Design Assets
Place your static design files in appropriate folders:
- **Icons**: `icons/` - App logo, UI icons, navigation icons
- **Illustrations**: `illustrations/` - Empty states, onboarding graphics
- **UI Elements**: `ui/` - Buttons, patterns, decorative elements
- **Branding**: `branding/` - Logo variations, brand graphics

### 2. Importing Assets
Update the `index.js` file to export your design assets:

```javascript
// Import design assets
import appLogo from './branding/app-logo.svg'
import emptyStateIllustration from './illustrations/empty-feed.svg'
import loadingSpinner from './ui/loading-spinner.svg'

// Export them
export {
  appLogo,
  emptyStateIllustration,
  loadingSpinner
}
```

### 3. Using in Components
Import and use in your React components:

```javascript
import { appLogo, emptyStateIllustration } from '../assets'

// Use in JSX
<img src={appLogo} alt="App Logo" />
<img src={emptyStateIllustration} alt="No posts yet" />
```

## User Content Flow

User-generated content follows this flow:
1. **Upload**: User selects image/video → Upload to Firebase Storage
2. **Store**: Firebase returns URL → Save URL to Firestore database
3. **Display**: Fetch URL from database → Display in app
4. **Manage**: Users can delete → Remove from both storage and database

## Recommended File Types

- **Icons**: SVG (scalable), PNG (with transparency)
- **Illustrations**: SVG (preferred), PNG
- **UI Elements**: SVG, PNG
- **Branding**: SVG (logos), PNG (complex graphics)

## File Naming Convention

Use descriptive, kebab-case names:
- `app-logo.svg`
- `empty-feed-illustration.svg`
- `loading-spinner.svg`
- `navigation-icon-home.svg`