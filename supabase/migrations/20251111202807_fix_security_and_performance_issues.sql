/*
  # Fix Security and Performance Issues

  ## Overview
  This migration addresses multiple security and performance issues identified by Supabase:
  1. Adds missing indexes for foreign keys
  2. Optimizes RLS policies to prevent auth function re-evaluation
  3. Removes unused indexes
  4. Fixes function search path mutability

  ## Changes

  ### Indexes Added
  - `idx_bookings_service_id` - Index for bookings.service_id foreign key
  - `idx_page_versions_updated_by` - Index for page_versions.updated_by foreign key
  - `idx_static_pages_updated_by` - Index for static_pages.updated_by foreign key

  ### RLS Policies Optimized
  All policies using `auth.uid()` are updated to use `(SELECT auth.uid())` to prevent re-evaluation per row:
  - static_pages: "Admins can insert static pages"
  - static_pages: "Admins can update static pages"
  - admin_users: "Admins can view admin users"
  - admin_users: "Admins can insert admin users"
  - admin_users: "Admins can update admin users"
  - page_versions: "Admins can view page versions"
  - page_versions: "Admins can insert page versions"

  ### Indexes Removed
  - `idx_page_versions_page_id` - Unused index
  - `idx_page_versions_created_at` - Unused index

  ### Function Fixes
  - `create_page_version` - Set immutable search_path

  ## Performance Impact
  - Improved query performance on foreign key lookups
  - Reduced CPU usage for RLS policy evaluation at scale
  - Cleaner index structure
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_page_versions_updated_by ON page_versions(updated_by);
CREATE INDEX IF NOT EXISTS idx_static_pages_updated_by ON static_pages(updated_by);

-- Drop unused indexes
DROP INDEX IF EXISTS idx_page_versions_page_id;
DROP INDEX IF EXISTS idx_page_versions_created_at;

-- Drop existing policies that need to be optimized
DROP POLICY IF EXISTS "Admins can insert static pages" ON static_pages;
DROP POLICY IF EXISTS "Admins can update static pages" ON static_pages;
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view page versions" ON page_versions;
DROP POLICY IF EXISTS "Admins can insert page versions" ON page_versions;

-- Recreate policies with optimized auth function calls
-- static_pages policies
CREATE POLICY "Admins can insert static pages"
  ON static_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can update static pages"
  ON static_pages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- admin_users policies
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- page_versions policies
CREATE POLICY "Admins can view page versions"
  ON page_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can insert page versions"
  ON page_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- Fix function search path by recreating with SECURITY DEFINER and set search_path
CREATE OR REPLACE FUNCTION create_page_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO page_versions (page_id, content, updated_by)
  VALUES (NEW.id, OLD.content, NEW.updated_by);
  RETURN NEW;
END;
$$;