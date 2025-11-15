/*
  # Create Static Pages and Admin System Tables

  ## Overview
  This migration creates the infrastructure for managing static content pages (Privacy Policy, Terms of Service)
  and administrative user authentication.

  ## New Tables
  
  ### `static_pages`
  Stores content for static pages like privacy policy and terms of service
  - `id` (uuid, primary key) - Unique identifier for each page
  - `page_type` (text, unique) - Type of page (privacy_policy, terms_of_service)
  - `title` (text) - Page title
  - `content` (text) - HTML content of the page
  - `created_at` (timestamptz) - When the page was created
  - `updated_at` (timestamptz) - When the page was last updated
  - `updated_by` (uuid) - Reference to the admin user who last updated it

  ### `admin_users`
  Stores administrative users who can edit static pages
  - `id` (uuid, primary key) - Links to auth.users.id
  - `email` (text, unique) - Admin email address
  - `full_name` (text) - Admin full name
  - `created_at` (timestamptz) - When the admin was created
  - `last_login` (timestamptz) - Last login timestamp

  ### `page_versions`
  Stores version history of page content changes
  - `id` (uuid, primary key) - Unique identifier for each version
  - `page_id` (uuid) - Reference to static_pages
  - `content` (text) - Content snapshot
  - `updated_by` (uuid) - Admin who made the change
  - `created_at` (timestamptz) - When this version was created

  ## Security
  - Enable RLS on all tables
  - static_pages: Public read access, admin-only write access
  - admin_users: Admin-only access
  - page_versions: Admin-only access
  
  ## Initial Data
  - Creates default empty entries for privacy_policy and terms_of_service pages
*/

-- Create static_pages table
CREATE TABLE IF NOT EXISTS static_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text UNIQUE NOT NULL,
  title text NOT NULL,
  content text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create page_versions table for version history
CREATE TABLE IF NOT EXISTS page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES static_pages(id) ON DELETE CASCADE,
  content text NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;

-- Policies for static_pages
-- Anyone can read static pages
CREATE POLICY "Anyone can view static pages"
  ON static_pages
  FOR SELECT
  USING (true);

-- Only admins can insert static pages
CREATE POLICY "Admins can insert static pages"
  ON static_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can update static pages
CREATE POLICY "Admins can update static pages"
  ON static_pages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies for admin_users
-- Admins can view all admin users
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can insert new admin users
CREATE POLICY "Admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can update admin users (including their own last_login)
CREATE POLICY "Admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies for page_versions
-- Admins can view page versions
CREATE POLICY "Admins can view page versions"
  ON page_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can insert page versions
CREATE POLICY "Admins can insert page versions"
  ON page_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_static_pages_page_type ON static_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_page_versions_page_id ON page_versions(page_id);
CREATE INDEX IF NOT EXISTS idx_page_versions_created_at ON page_versions(created_at DESC);

-- Function to automatically create page version on update
CREATE OR REPLACE FUNCTION create_page_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO page_versions (page_id, content, updated_by)
  VALUES (NEW.id, OLD.content, NEW.updated_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create version history
DROP TRIGGER IF EXISTS trigger_create_page_version ON static_pages;
CREATE TRIGGER trigger_create_page_version
  BEFORE UPDATE ON static_pages
  FOR EACH ROW
  WHEN (OLD.content IS DISTINCT FROM NEW.content)
  EXECUTE FUNCTION create_page_version();

-- Insert default static pages
INSERT INTO static_pages (page_type, title, content)
VALUES 
  ('privacy_policy', 'Política de Privacidade', '<h1>Política de Privacidade</h1><p>Conteúdo da política de privacidade será adicionado aqui.</p>'),
  ('terms_of_service', 'Termos de Serviço', '<h1>Termos de Serviço</h1><p>Conteúdo dos termos de serviço será adicionado aqui.</p>')
ON CONFLICT (page_type) DO NOTHING;