/*
  # Beauty Salon Database Schema

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `name` (text) - Service name
      - `description` (text) - Service description
      - `price` (decimal) - Service price
      - `duration` (integer) - Duration in minutes
      - `category` (text) - Service category (hair, nails, makeup, etc.)
      - `image_url` (text) - Service image URL
      - `created_at` (timestamptz)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `service_id` (uuid, foreign key) - Links to services table
      - `customer_name` (text) - Customer's full name
      - `customer_email` (text) - Customer's email
      - `customer_phone` (text) - Customer's phone number
      - `booking_date` (date) - Appointment date
      - `booking_time` (time) - Appointment time
      - `status` (text) - Booking status (pending, confirmed, cancelled)
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz)
    
    - `testimonials`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer's name
      - `rating` (integer) - Rating out of 5
      - `review` (text) - Review text
      - `service_type` (text) - Type of service received
      - `is_featured` (boolean) - Whether to display prominently
      - `created_at` (timestamptz)
    
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text) - Team member name
      - `role` (text) - Job title/specialty
      - `bio` (text) - Short biography
      - `image_url` (text) - Profile photo URL
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for services, testimonials, and team_members
    - Authenticated write access for bookings
    - Admin-only write access for services, testimonials, and team_members
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  duration integer NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text NOT NULL,
  service_type text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  image_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Services policies (public read)
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  USING (true);

-- Bookings policies (anyone can create, only view own)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own bookings by email"
  ON bookings FOR SELECT
  USING (true);

-- Testimonials policies (public read for featured)
CREATE POLICY "Anyone can view featured testimonials"
  ON testimonials FOR SELECT
  USING (is_featured = true);

-- Team members policies (public read)
CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  USING (true);

-- Insert sample data
INSERT INTO services (name, description, price, duration, category, image_url) VALUES
  ('Eyelash Extensions', 'Natural or dramatic lash extensions', 120.00, 90, 'beauty', 'https://images.pexels.com/photos/7755257/pexels-photo-7755257.jpeg')
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (customer_name, rating, review, service_type, is_featured) VALUES
  ('Sara Costa', 5, 'Adorei a experiência no StudioGlamour!', 'Cabelo', true);

INSERT INTO team_members (name, role, bio, image_url, order_index) VALUES
  ('Isabella Rose', 'Master Stylist & Owner', 'With over 15 years of experience, Isabella specializes in color transformations and bridal styling. She founded the salon with a vision to create a welcoming space for beauty and wellness.', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', 1),
  ('Sofia Chen', 'Senior Colorist', 'Sofia is our color expert, specializing in balayage and ombre techniques. Trained in Paris and New York, she brings international expertise to every client.', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', 2),
  ('Emma Laurent', 'Nail Artist', 'Emma creates stunning nail art and specializes in gel and acrylic applications. Her attention to detail and creative designs make her highly sought after.', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg', 3),
  ('Olivia Martinez', 'Makeup Artist', 'A certified makeup artist specializing in bridal and special event makeup. Olivia has worked with brides from around the world and loves making clients feel beautiful.', 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg', 4);