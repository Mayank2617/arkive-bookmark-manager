# Supabase CLI Helper Scripts for Windows
# Use these instead of global installation

# Link to Supabase project
npx supabase link --project-ref your-project-id

# Push migrations to remote
npx supabase db push

# Deploy Edge Functions
npx supabase functions deploy enrich-metadata

# Start local Supabase
npx supabase start

# Reset local database
npx supabase db reset

# Create new migration
npx supabase migration new migration-name
