#!/bin/bash
# Migration Helper Script
# Helps run Supabase migrations in different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Smart Bookmark App - Database Migration Script${NC}"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed${NC}"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

# Function to show usage
show_usage() {
    echo "Usage: ./migrate.sh [command]"
    echo ""
    echo "Commands:"
    echo "  local       - Run migrations on local Supabase instance"
    echo "  remote      - Run migrations on remote Supabase project"
    echo "  reset       - Reset local database (WARNING: deletes all data)"
    echo "  status      - Show migration status"
    echo "  new [name]  - Create a new migration file"
    echo ""
}

# Parse command
COMMAND=${1:-""}

case $COMMAND in
    local)
        echo -e "${YELLOW}Running migrations on local Supabase...${NC}"
        supabase start
        supabase db reset
        echo -e "${GREEN}Local migrations completed!${NC}"
        echo "Access Supabase Studio at: http://localhost:54323"
        ;;
    
    remote)
        echo -e "${YELLOW}Running migrations on remote Supabase project...${NC}"
        
        # Check if project is linked
        if [ ! -f ".supabase/config.toml" ]; then
            echo -e "${RED}Error: Not linked to a Supabase project${NC}"
            echo "Run: supabase link --project-ref your-project-id"
            exit 1
        fi
        
        supabase db push
        echo -e "${GREEN}Remote migrations completed!${NC}"
        ;;
    
    reset)
        echo -e "${RED}WARNING: This will delete all data in your local database!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${YELLOW}Resetting local database...${NC}"
            supabase db reset
            echo -e "${GREEN}Database reset completed!${NC}"
        else
            echo "Reset cancelled."
        fi
        ;;
    
    status)
        echo -e "${YELLOW}Checking migration status...${NC}"
        supabase migration list
        ;;
    
    new)
        MIGRATION_NAME=${2:-""}
        if [ -z "$MIGRATION_NAME" ]; then
            echo -e "${RED}Error: Migration name is required${NC}"
            echo "Usage: ./migrate.sh new <migration_name>"
            exit 1
        fi
        
        echo -e "${YELLOW}Creating new migration: ${MIGRATION_NAME}${NC}"
        supabase migration new "$MIGRATION_NAME"
        echo -e "${GREEN}Migration file created!${NC}"
        ;;
    
    *)
        show_usage
        exit 1
        ;;
esac
