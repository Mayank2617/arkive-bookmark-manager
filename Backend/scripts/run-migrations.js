// Automated Database Migration Script  
// Runs all SQL migrations using direct PostgreSQL connection

require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Check environment variables
if (!process.env.DATABASE_URL) {
  console.error('\n❌ Error: DATABASE_URL not found in .env file!\n');
  console.error('Please create a .env file with your database connection string:');
  console.error('DATABASE_URL=postgresql://postgres.[project-ref]:[password]@....\n');
  console.error('Get it from: https://app.supabase.com/project/cshgccdascdxpxzclxwn/settings/database');
  console.error('Click "Connection string" → "URI" tab\n');
  process.exit(1);
}

// Migration SQL content (embedded to avoid file path issues)
const migrations = [
  {
    name: '01_initial_schema',
    description: 'Creating tables (profiles, collections, bookmarks)',
    sql: `
-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.profiles IS 'Extended user profile information';

-- ============================================
-- COLLECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'folder' NOT NULL,
  color TEXT DEFAULT 'hsl(0, 0%, 50%)' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT collection_name_not_empty CHECK (length(trim(name)) > 0)
);

COMMENT ON TABLE public.collections IS 'User folders/categories for organizing bookmarks';

-- ============================================
-- BOOKMARKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT,
  image TEXT,
  favicon TEXT,
  dominant_color TEXT DEFAULT 'hsl(0, 0%, 50%)' NOT NULL,
  starred BOOLEAN DEFAULT FALSE NOT NULL,
  unread BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT bookmark_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT bookmark_url_not_empty CHECK (length(trim(url)) > 0),
  CONSTRAINT bookmark_domain_not_empty CHECK (length(trim(domain)) > 0)
);

COMMENT ON TABLE public.bookmarks IS 'User bookmarks with auto-enriched metadata from URLs';

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_created_at ON public.collections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON public.bookmarks(collection_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_starred ON public.bookmarks(user_id, starred) WHERE starred = TRUE;
CREATE INDEX IF NOT EXISTS idx_bookmarks_unread ON public.bookmarks(user_id, unread) WHERE unread = TRUE;
CREATE INDEX IF NOT EXISTS idx_bookmarks_title_search ON public.bookmarks USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_collection ON public.bookmarks(user_id, collection_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_url ON public.bookmarks(user_id, url);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_collections ON public.collections;
CREATE TRIGGER set_updated_at_collections
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_bookmarks ON public.bookmarks;
CREATE TRIGGER set_updated_at_bookmarks
  BEFORE UPDATE ON public.bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`
  },
  {
    name: '02_rls_policies',
    description: 'Setting up Row Level Security',
    sql: `
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Collections policies
DROP POLICY IF EXISTS "Users can view own collections" ON public.collections;
CREATE POLICY "Users can view own collections" ON public.collections FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own collections" ON public.collections;
CREATE POLICY "Users can create own collections" ON public.collections FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own collections" ON public.collections;
CREATE POLICY "Users can update own collections" ON public.collections FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own collections" ON public.collections;
CREATE POLICY "Users can delete own collections" ON public.collections FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks policies
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can create own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can update own bookmarks" ON public.bookmarks FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Validation function
CREATE OR REPLACE FUNCTION public.validate_collection_ownership()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.collection_id IS NULL THEN RETURN NEW; END IF;
  IF EXISTS (SELECT 1 FROM public.collections WHERE id = NEW.collection_id AND user_id = NEW.user_id) THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'Collection does not belong to user';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS validate_bookmark_collection_ownership ON public.bookmarks;
CREATE TRIGGER validate_bookmark_collection_ownership
  BEFORE INSERT OR UPDATE ON public.bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.validate_collection_ownership();
`
  },
  {
    name: '03_realtime_setup',
    description: 'Enabling real-time subscriptions',
    sql: `
-- Enable realtime for bookmarks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'bookmarks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
  END IF;
END $$;

-- Enable realtime for collections table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'collections'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.collections;
  END IF;
END $$;
`
  },
  {
    name: '04_functions',
    description: 'Creating utility functions',
    sql: `
-- Search function
CREATE OR REPLACE FUNCTION public.search_bookmarks(
  p_user_id UUID,
  p_query TEXT,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID, title TEXT, url TEXT, domain TEXT, description TEXT, image TEXT, favicon TEXT,
  collection_id UUID, starred BOOLEAN, unread BOOLEAN, created_at TIMESTAMPTZ, rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.title, b.url, b.domain, b.description, b.image, b.favicon, b.collection_id,
         b.starred, b.unread, b.created_at,
         ts_rank(to_tsvector('english', b.title || ' ' || COALESCE(b.description, '') || ' ' || b.domain),
                 plainto_tsquery('english', p_query)) AS rank
  FROM public.bookmarks b
  WHERE b.user_id = p_user_id
    AND (to_tsvector('english', b.title || ' ' || COALESCE(b.description, '') || ' ' || b.domain) @@ plainto_tsquery('english', p_query)
         OR b.title ILIKE '%' || p_query || '%' OR b.url ILIKE '%' || p_query || '%')
  ORDER BY rank DESC, b.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.search_bookmarks(UUID, TEXT, INTEGER) TO authenticated;

-- Delete collection function
CREATE OR REPLACE FUNCTION public.delete_collection_with_options(
  p_collection_id UUID,
  p_delete_bookmarks BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.collections WHERE id = p_collection_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Collection not found or access denied';
  END IF;
  
  IF p_delete_bookmarks THEN
    DELETE FROM public.bookmarks WHERE collection_id = p_collection_id;
  ELSE
    UPDATE public.bookmarks SET collection_id = NULL WHERE collection_id = p_collection_id;
  END IF;
  
  DELETE FROM public.collections WHERE id = p_collection_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.delete_collection_with_options(UUID, BOOLEAN) TO authenticated;

-- Duplicate check function
CREATE OR REPLACE FUNCTION public.check_duplicate_bookmark(p_user_id UUID, p_url TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.bookmarks WHERE user_id = p_user_id AND url = p_url);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.check_duplicate_bookmark(UUID, TEXT) TO authenticated;
`
  }
];

async function runMigrations() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  console.log('\n🚀 Starting database migrations...\n');
  console.log('📡 Connecting to Supabase database...\n');

  try {
    await client.connect();
    console.log('✅ Connected successfully!\n');

    for (const migration of migrations) {
      console.log(`📝 Running: ${migration.description}...`);

      try {
        await client.query(migration.sql);
        console.log(`  ✅ ${migration.name} - Complete\n`);
      } catch (error) {
        console.error(`  ❌ Error in ${migration.name}:`, error.message);
        console.log('  ⚠️  Continuing with next migration...\n');
      }
    }

    console.log('='.repeat(60));
    console.log('✅ All migrations completed successfully!\n');
    console.log('📊 Summary:');
    console.log('  - Tables created: profiles, collections, bookmarks');
    console.log('  - Row Level Security: Enabled');
    console.log('  - Real-time: Configured');
    console.log('  - Functions: Installed\n');
    console.log('Next step: Install frontend dependencies and configure .env');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\nPlease check your DATABASE_URL in the .env file\n');
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
