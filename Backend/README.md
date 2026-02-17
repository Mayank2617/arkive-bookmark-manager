# Smart Bookmark App - Backend

Serverless backend built with Supabase (PostgreSQL + Realtime + Edge Functions) for the Smart Bookmark Manager application.

## Architecture Overview

- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Google OAuth via Supabase Auth
- **Real-time**: Supabase Realtime for instant sync across tabs
- **Metadata Enrichment**: Edge Functions for URL metadata scraping
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## Prerequisites

1. **Node.js** 18+ and pnpm
2. **Supabase CLI**: `npm install -g supabase`
3. **Docker** (for local Supabase development)
4. **Supabase Account**: [Create account](https://app.supabase.com)

## Quick Start

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Note your project credentials:
   - Project URL
   - Anon Key
   - Service Role Key

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
```

### 3. Set Up Google OAuth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials (from Google Cloud Console)
4. Add authorized redirect URLs:
   - `http://localhost:3000/auth/callback` (local)
   - `https://your-app.vercel.app/auth/callback` (production)

### 4. Run Database Migrations

```bash
# Link to your Supabase project
supabase link --project-ref your-project-id

# Apply migrations
supabase db push
```

### 5. Deploy Edge Functions

```bash
# Deploy metadata enrichment function
supabase functions deploy enrich-metadata
```

## Project Structure

```
Backend/
├── supabase/
│   ├── config.toml              # Supabase CLI configuration
│   ├── migrations/              # Database schema migrations
│   │   ├── 20260214000001_initial_schema.sql
│   │   ├── 20260214000002_rls_policies.sql
│   │   ├── 20260214000003_realtime_setup.sql
│   │   └── 20260214000004_functions.sql
│   └── functions/               # Edge Functions (Deno runtime)
│       └── enrich-metadata/
│           └── index.ts
├── scripts/
│   └── migrate.sh               # Migration helper script
└── .env.local.example           # Environment variables template
```

## Database Schema

### Tables

#### `profiles`
Extended user information
- `id` (UUID, references auth.users)
- `email` (TEXT)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMPTZ)

#### `collections`
Folders/categories for organizing bookmarks
- `id` (UUID)
- `user_id` (UUID, references auth.users)
- `name` (TEXT)
- `icon` (TEXT)
- `color` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### `bookmarks`
User's saved URLs with enriched metadata
- `id` (UUID)
- `user_id` (UUID, references auth.users)
- `collection_id` (UUID, references collections)
- `title` (TEXT)
- `url` (TEXT)
- `domain` (TEXT)
- `description` (TEXT)
- `image` (TEXT)
- `favicon` (TEXT)
- `dominant_color` (TEXT)
- `starred` (BOOLEAN)
- `unread` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Complete data isolation at database level
- Private by default security model

## Edge Functions

### `enrich-metadata`

Fetches and parses metadata from URLs.

**Endpoint**: `/functions/v1/enrich-metadata`

**Request**:
```json
{
  "url": "https://github.com"
}
```

**Response**:
```json
{
  "title": "GitHub: Let's build from here",
  "description": "GitHub is where over 100 million developers...",
  "image": "https://github.githubassets.com/images/modules/site/social-cards/github-social.png",
  "favicon": "https://github.com/favicon.ico",
  "domain": "github.com",
  "dominantColor": "hsl(0, 0%, 15%)"
}
```

## Deployment

### Production Deployment

1. **Push migrations to production**:
```bash
supabase db push --project-ref your-project-id
```

2. **Deploy Edge Functions**:
```bash
supabase functions deploy enrich-metadata --project-ref your-project-id
```

3. **Update Frontend Environment Variables** in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`

## Testing

### Test RLS Policies

```sql
-- Test as user
SELECT * FROM bookmarks WHERE user_id = auth.uid();

-- Should return empty for other users
SELECT * FROM bookmarks WHERE user_id != auth.uid();
```

### Test Edge Function Locally

```bash
# Serve function locally
supabase functions serve enrich-metadata

# Test with curl
curl -X POST http://localhost:54321/functions/v1/enrich-metadata \
  -H "Content-Type: application/json" \
  -d '{"url": "https://vercel.com"}'
```

## Local Development

```bash
# Start local Supabase instance
supabase start

# View Supabase Studio
open http://localhost:54323

# Run migrations
supabase db reset

# Deploy functions locally
supabase functions serve
```

## Troubleshooting

### Migrations Not Applying

```bash
# Reset local database
supabase db reset

# Or manually apply
supabase db push --include-all
```

### Edge Function Not Working

- Check Deno runtime compatibility
- Verify CORS headers
- Check function logs: `supabase functions logs enrich-metadata`

### RLS Blocking Valid Queries

- Ensure `auth.uid()` is available in policies
- Check if user is authenticated
- Verify policy conditions match your use case

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Next.js Integration Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
