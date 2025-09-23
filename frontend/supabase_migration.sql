-- Migration script to create the face_metadata table
-- Run this in your Supabase SQL editor

-- Create the face_metadata table for quality assessment
CREATE TABLE IF NOT EXISTS face_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  face_image_id UUID NOT NULL REFERENCES face_images(id) ON DELETE CASCADE,
  quality_overall VARCHAR(10) NOT NULL CHECK (quality_overall IN ('High', 'Medium', 'Low')),
  quality_face_size VARCHAR(10) NOT NULL CHECK (quality_face_size IN ('High', 'Medium', 'Low')),
  quality_sharpness VARCHAR(10) NOT NULL CHECK (quality_sharpness IN ('High', 'Medium', 'Low')),
  quality_lighting VARCHAR(10) NOT NULL CHECK (quality_lighting IN ('High', 'Medium', 'Low')),
  face_width INTEGER NOT NULL,
  face_height INTEGER NOT NULL,
  sharpness_variance DECIMAL(10,2) NOT NULL,
  brightness_value DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_face_metadata_face_image_id ON face_metadata(face_image_id);
CREATE INDEX IF NOT EXISTS idx_face_metadata_quality_overall ON face_metadata(quality_overall);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE face_metadata ENABLE ROW LEVEL SECURITY;

-- Grant permissions (adjust based on your setup)
-- GRANT ALL ON face_metadata TO authenticated;
-- GRANT ALL ON face_metadata TO service_role;
