/*
  # Create contact_submissions table

  ## Summary
  Stores contact/quote form submissions from the Pyrōva Robotics website.

  ## New Tables
  - `contact_submissions`
    - `id` (uuid, primary key)
    - `name` (text) - submitter's full name
    - `business_name` (text) - name of their business
    - `space_type` (text) - type of space (cafe, store, event, etc.)
    - `message` (text) - their inquiry message
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public INSERT allowed (anyone can submit the form)
  - No SELECT policy for public (form submissions are private)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  business_name text NOT NULL DEFAULT '',
  space_type text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
