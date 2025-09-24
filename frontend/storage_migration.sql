-- Migration script to update face_images table for Supabase Storage
-- Run this in your Supabase SQL editor

-- Add storage_path column to face_images table
ALTER TABLE face_images ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Update existing records to have storage_path (you may need to handle this manually for existing data)
-- For new records, this will be populated automatically

-- Remove the image_data column (base64 data) - uncomment when ready to remove old data
-- ALTER TABLE face_images DROP COLUMN IF EXISTS image_data;

-- Add index for storage_path for better performance
CREATE INDEX IF NOT EXISTS idx_face_images_storage_path ON face_images(storage_path);

-- Create storage bucket if it doesn't exist (this needs to be done via Supabase dashboard or API)
-- The bucket will be created automatically by the application when needed

-- Update the image_url column comment for clarity
COMMENT ON COLUMN face_images.image_url IS 'URL to image in Supabase Storage';
COMMENT ON COLUMN face_images.storage_path IS 'Path in storage bucket for direct access';

-- Optional: Add constraint to ensure storage_path is not empty for new records
-- ALTER TABLE face_images ADD CONSTRAINT check_storage_path_not_empty 
-- CHECK (storage_path IS NOT NULL AND storage_path != '');

-- Note: If you have existing data with base64 images, you'll need to:
-- 1. Upload those images to Supabase Storage
-- 2. Update the image_url and storage_path columns
-- 3. Then you can safely drop the image_data column
