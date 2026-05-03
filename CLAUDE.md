# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Supabase backend project (project ref: `hkkdmonrzpvzcddfpyrn`). The repository serves as the workspace for managing the Supabase database, Edge Functions, auth configuration, and storage. There is no traditional build pipeline — all operations go through the Supabase MCP server or Supabase CLI.

## MCP Servers

Two MCP servers are available in this project:

- **Supabase** (`mcp__supabase__*`) — connected directly to project `hkkdmonrzpvzcddfpyrn`. Use this for migrations, SQL execution, Edge Function deployment, logs, and schema inspection.
- **Vercel** (`mcp__claude_ai_Vercel__*`) — available for deployments and project management if a frontend is added.

Always use the Supabase MCP tools rather than raw SQL strings where possible. For schema changes, use `mcp__supabase__apply_migration` so changes are tracked as migrations.

## Installed Skills

- `/supabase` — use for any Supabase task (database design, RLS policies, Edge Functions, auth, storage, realtime)
- `/supabase-postgres-best-practices` — invoke when optimizing queries, designing indexes, or reviewing schema performance

## Working with Supabase

- **Schema changes** → `mcp__supabase__apply_migration` (never `execute_sql` for DDL — it bypasses migration tracking)
- **Data queries / ad-hoc SQL** → `mcp__supabase__execute_sql`
- **Deploy Edge Functions** → `mcp__supabase__deploy_edge_function`
- **Inspect current schema** → `mcp__supabase__list_tables`, `mcp__supabase__generate_typescript_types`
- **Check migration history** → `mcp__supabase__list_migrations`
- **View logs** → `mcp__supabase__get_logs`

## Architecture Notes

As the project grows, follow these conventions:
- All database changes must go through numbered migrations (applied via MCP) so history is preserved.
- Row-Level Security (RLS) should be enabled on every user-facing table from the start.
- Edge Functions live in `supabase/functions/` and are Deno-based (TypeScript).
- Environment secrets for Edge Functions are managed in the Supabase dashboard, not committed to the repo.
