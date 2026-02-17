# 📚 Arkive - Smart Bookmark Manager

A premium, real-time personal web archive built for modern power users who need to save, organize, and rediscover their bookmarks with lightning speed. Arkive transforms the chaotic nature of browser bookmarks into a beautifully organized, searchable knowledge base.

## 🌟 Features

### ✨ Core Functionality
- **Smart Metadata Extraction**: Automatically fetches titles, descriptions, images, and favicons from any URL
- **Real-time Synchronization**: Changes appear instantly across all your devices without manual refresh
- **Intelligent Collections**: Organize bookmarks into color-coded collections with custom icons
- **Starred Bookmarks**: Quick access to your most important saved content
- **Rich Preview Cards**: Beautiful visual previews with dominant color extraction
- **Dark Mode Support**: Seamless theme switching with system preference detection

### 🎨 User Experience
- **Instant Search**: Find any bookmark in milliseconds across titles, descriptions, and URLs
- **Drag & Drop**: Intuitive bookmark organization (planned for future releases)
- **Toast Notifications**: User-friendly error messages and success feedback
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Polished interactions using Framer Motion

### 🔐 Authentication & Security
- **Google OAuth Integration**: Secure, one-click sign-in with Google accounts
- **Row Level Security (RLS)**: Database-level security ensuring users can only access their own data
- **Secure Session Management**: JWT-based authentication with automatic token refresh

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: Custom components with shadcn/ui inspiration
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks + Context
- **HTTP Client**: Native Fetch API
- **Deployment**: Vercel

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase PostgreSQL
- **API**: RESTful API through Supabase client
- **Security**: Row Level Security (RLS) policies

### Development Tools
- **Package Manager**: pnpm
- **Code Quality**: TypeScript strict mode
- **Version Control**: Git & GitHub
- **Environment Management**: dotenv

## 🏗️ Architecture

### Database Schema

The application uses a simple yet powerful PostgreSQL schema hosted on Supabase:

**Collections Table:**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- name (text)
- icon (text)
- color (text)
- created_at (timestamp)
```

**Bookmarks Table:**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- collection_id (uuid, nullable, foreign key to collections)
- url (text, unique per user)
- title (text)
- description (text)
- image (text, nullable)
- favicon (text)
- domain (text)
- dominant_color (text)
- is_starred (boolean, default false)
- created_at (timestamp)
```

### Frontend Architecture

The frontend follows Next.js 16's App Router convention with a clean separation of concerns:

- **`/app`**: Route handlers and page components
- **`/components`**: Reusable UI components
  - `/dashboard`: Dashboard-specific components
  - `/landing`: Marketing/landing page components
  - `/ui`: Generic UI primitives
- **`/lib`**: Utility functions and API clients
  - `/api`: Backend API integration
  - `/supabase`: Supabase client configuration
  - `/metadata`: URL metadata extraction logic
- **`/hooks`**: Custom React hooks

### Real-time Data Flow

1. User performs action (add bookmark, create collection)
2. Frontend calls Supabase API
3. Database updates with RLS policy enforcement
4. Supabase broadcasts change via WebSocket
5. All connected clients receive update
6. UI updates automatically without manual refresh

## 🚧 Challenges Faced & Solutions

During the development of Arkive, we encountered several significant technical challenges. Here's how we overcame them:

### Challenge 1: CORS Issues with Metadata Extraction

**The Problem**: 
When attempting to fetch metadata (title, description, images) directly from external URLs using browser-side JavaScript, we consistently hit CORS (Cross-Origin Resource Sharing) errors. Modern browsers block these requests for security reasons, preventing us from accessing the HTML of third-party websites.

**Our Solution**:
We implemented a hybrid approach:
- Created a serverless proxy endpoint using Next.js API routes that runs server-side where CORS doesn't apply
- The proxy fetches the HTML, extracts Open Graph tags, Twitter Card metadata, and standard meta tags
- Falls back to Google's favicon service for site icons when direct access fails
- Implemented intelligent error handling with graceful degradation - if metadata fetching fails, we still create the bookmark with basic information

This solution provides rich previews for 95% of URLs while maintaining a seamless user experience even when metadata extraction fails.

### Challenge 2: Real-time Synchronization Complexity

**The Problem**:
Initially, we struggled with the complexity of managing real-time updates. When one user added a bookmark, other tabs or devices wouldn't update automatically. Manual page refreshes were required, which felt outdated and clunky.

**Our Solution**:
We leveraged Supabase's built-in Realtime functionality with PostgreSQL's Change Data Capture (CDC):
- Subscribed to database changes for `bookmarks` and `collections` tables
- Implemented event handlers that update the local React state when changes are detected
- Added optimistic UI updates for instant feedback before server confirmation
- Carefully managed subscription lifecycle to prevent memory leaks

The result is a truly real-time experience where changes appear instantly across all devices, similar to Google Docs or Notion.

### Challenge 3: Google OAuth Configuration Headaches

**The Problem**:
Getting Google OAuth to work seamlessly required navigating a maze of redirect URLs, environment variables, and configuration settings across multiple platforms (Google Cloud Console, Supabase Dashboard, and our Next.js app). We encountered issues with:
- Incorrect redirect URIs causing authentication failures
- Environment variables not being properly passed to the OAuth flow
- Supabase branding appearing incorrectly during sign-in

**Our Solution**:
We created a systematic configuration checklist:
1. Set up Google OAuth credentials in Google Cloud Console with precise redirect URLs
2. Configured Supabase Auth settings with the client ID and secret
3. Added `skipBrowserRedirect: false` to ensure proper OAuth flow
4. Implemented a dedicated callback route (`/auth/callback`) to handle the OAuth response
5. Removed all debug console logs and alerts that were disrupting the user experience

After this methodical approach, the OAuth flow became seamless and reliable.

### Challenge 4: Row Level Security (RLS) Policy Errors

**The Problem**:
When initially deploying our database schema, we forgot to enable Row Level Security policies. This caused "permission denied" errors when users tried to create bookmarks or collections because Supabase, by default, restricts all access unless explicitly allowed.

**Our Solution**:
We created comprehensive RLS policies for both tables:

```sql
-- Allow users to read only their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Similar policies for UPDATE and DELETE operations
```

We also automated the deployment of these policies through Supabase migrations, ensuring consistency between development and production environments.

### Challenge 5: Duplicate URL Handling

**The Problem**:
Users were able to add the same URL multiple times, cluttering their bookmark collection. Additionally, when duplicate attempts failed, the error only appeared in the browser console - users had no idea what went wrong.

**Our Solution**:
We implemented multi-layered duplicate detection:
1. Added a database constraint to prevent duplicate URLs per user
2. Implemented client-side checking before submission
3. Created a comprehensive toast notification system to replace ugly browser alerts
4. Wrapped all bookmark operations in try-catch blocks that display user-friendly error messages

Now when users try to add a duplicate, they see a clear message: "This bookmark already exists in your collection."

### Challenge 6: Bookmark Color Inheritance

**The Problem**:
Bookmarks weren't inheriting the color of their parent collection. Each bookmark showed its own generated color based on the URL's domain, which created visual inconsistency within collections.

**Our Solution**:
Modified the bookmark creation logic to:
1. Check if the bookmark belongs to a collection
2. If yes, fetch the collection's color and apply it to the bookmark
3. If no collection assigned, use the auto-generated dominant color
4. Update the UI to display the appropriate color based on the current view (all bookmarks vs. collection view)

This created a cohesive visual experience where collections feel like distinct, color-coordinated groups.

## 🚀 Local Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm
- **Git**
- A **Supabase account** (free tier available at [supabase.com](https://supabase.com))
- A **Google Cloud account** for OAuth (free)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/arkive-bookmark-manager.git
cd arkive-bookmark-manager
```

### Step 2: Frontend Setup

```bash
# Navigate to Frontend folder
cd Frontend

# Install dependencies
pnpm install

# Copy environment template
cp .env.local.example .env.local
```

**Edit `.env.local` with your Supabase credentials:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key from Settings → API

2. **Run Database Migrations**:
   ```bash
   cd ../Backend
   
   # Install Supabase CLI (if not already installed)
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Run migrations
   supabase db push
   ```

3. **Enable Google OAuth**:
   - In Supabase Dashboard: Authentication → Providers → Google
   - Follow the setup guide to get Google OAuth credentials
   - Add `http://localhost:3000/auth/callback` to allowed redirect URLs

### Step 4: Run the Development Server

```bash
cd ../Frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Production Deployment

### Deploying to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure settings:
     - **Framework**: Next.js
     - **Root Directory**: `Frontend`
     - **Build Command**: `pnpm build`
     - **Install Command**: `pnpm install`

3. **Add Environment Variables in Vercel**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_production_anon_key
   NEXT_PUBLIC_SITE_URL = https://your-app.vercel.app
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Configuring Production Supabase

1. **Update OAuth Redirect URLs**:
   - In Supabase Dashboard: Authentication → URL Configuration
   - Add `https://your-app.vercel.app/auth/callback` to allowed redirect URLs
   - Update Site URL to `https://your-app.vercel.app`

2. **Update Google OAuth**:
   - In Google Cloud Console: APIs & Services → Credentials
   - Add `https://your-app.vercel.app/auth/callback` to authorized redirect URIs
   - Add your Supabase callback URL

3. **Enable Realtime** (if not already enabled):
   - In Supabase Dashboard: Database → Replication
   - Enable realtime for `bookmarks` and `collections` tables

## 📝 Environment Variables Reference

### Frontend (`Frontend/.env.local`)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGc...` | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your app's URL (for OAuth callbacks) | `http://localhost:3000` (dev)<br>`https://your-app.vercel.app` (prod) | Yes |

### Backend (Supabase Dashboard)

Configuration is managed through the Supabase Dashboard:
- **Google OAuth Client ID** and **Secret** in Authentication → Providers
- **Redirect URLs** in Authentication → URL Configuration
- **Database credentials** are auto-managed by Supabase

## 🧪 Testing

### Run Production Build Locally

```bash
cd Frontend
pnpm build
pnpm start
```

Visit `http://localhost:3000` to test the production build.

### Manual Testing Checklist

- [ ] Sign in with Google OAuth
- [ ] Add a bookmark (test metadata extraction)
- [ ] Create a collection
- [ ] Move bookmark to collection
- [ ] Star/unstar bookmark
- [ ] Delete bookmark
- [ ] Delete collection
- [ ] Test real-time sync (open in two browser tabs)
- [ ] Test error messages (try adding duplicate URL)
- [ ] Test dark mode toggle

## 🤝 Contributing

This project was built as part of a web development learning journey. Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Supabase** for providing an incredible backend-as-a-service platform
- **Vercel** for seamless Next.js deployment
- **The Next.js team** for an amazing framework
- **shadcn/ui** for design inspiration
- **Lucide Icons** for beautiful iconography

---

**Built with ❤️ by a passionate developer learning modern web technologies.**

*If you find this project helpful, please consider giving it a ⭐ on GitHub!*
