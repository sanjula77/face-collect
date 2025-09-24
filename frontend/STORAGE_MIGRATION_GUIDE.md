# Storage Migration Guide

This guide explains how to migrate from storing images as base64 data in the database to using Supabase Storage.

## Overview

The system has been updated to store face images in Supabase Storage instead of as base64 data in the database. This provides several benefits:

- **Better Performance**: Images are served directly from CDN
- **Reduced Database Size**: No more large base64 strings in the database
- **Better Scalability**: Storage can handle large files more efficiently
- **Cost Efficiency**: Storage is typically cheaper than database storage for large files

## Migration Steps

### 1. Run Database Migration

Execute the SQL migration script in your Supabase SQL editor:

```sql
-- Run the contents of storage_migration.sql
```

This will:
- Add a `storage_path` column to the `face_images` table
- Add an index for better performance
- Update column comments

### 2. Create Storage Bucket

The storage bucket will be created automatically when the first image is uploaded. However, you can also create it manually:

1. Go to your Supabase dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Name it `face-images`
5. Make it **Public** (for easy access)
6. Set file size limit to 5MB
7. Allow MIME types: `image/jpeg`, `image/png`, `image/webp`

### 3. Update Environment Variables

Make sure your environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Test the New System

1. Start a new face capture session
2. Capture images - they should now be uploaded to Supabase Storage
3. Check the admin panel to verify images are displayed correctly
4. Verify that image URLs point to Supabase Storage

## File Structure

Images are stored in the following structure:
```
face-images/
├── {user_id}/
│   └── {date}/
│       ├── center_2024-01-15_14-30-25.jpg
│       ├── left_2024-01-15_14-30-26.jpg
│       ├── right_2024-01-15_14-30-27.jpg
│       ├── up_2024-01-15_14-30-28.jpg
│       └── down_2024-01-15_14-30-29.jpg
```

## Database Schema Changes

### Before (Base64 Storage)
```sql
CREATE TABLE face_images (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  step VARCHAR(10),
  image_url TEXT,
  image_data TEXT, -- Base64 encoded image
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP,
  metadata JSONB
);
```

### After (Storage URLs)
```sql
CREATE TABLE face_images (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  step VARCHAR(10),
  image_url TEXT, -- URL to image in Supabase Storage
  storage_path TEXT, -- Path in storage bucket
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP,
  metadata JSONB
);
```

## Handling Existing Data

If you have existing data with base64 images, you have a few options:

### Option 1: Keep Both (Recommended for Transition)
- Keep the `image_data` column for existing records
- New records will use `image_url` and `storage_path`
- Gradually migrate old data as needed

### Option 2: Migrate Existing Data
1. Export existing base64 images
2. Upload them to Supabase Storage
3. Update the `image_url` and `storage_path` columns
4. Remove the `image_data` column

### Option 3: Start Fresh
- Delete existing data
- Start with the new storage system

## Code Changes Made

### 1. New Storage Module (`src/lib/storage.ts`)
- `uploadImageToStorage()` - Upload base64 to storage
- `deleteImageFromStorage()` - Delete from storage
- `getSignedUrl()` - Get signed URLs for private access
- `listUserImages()` - List user's images
- `ensureStorageBucket()` - Create bucket if needed

### 2. Updated Database Functions (`src/lib/database.ts`)
- Modified `FaceImageRecord` interface
- Updated `saveFaceImage()` function
- Enhanced `deleteUser()` to clean up storage

### 3. Updated Components
- `IntegratedFaceCapture.tsx` - Now uploads to storage
- `AdminPage.tsx` - Displays images from storage URLs
- `mlExport.ts` - Exports storage URLs instead of base64

## Storage Configuration

### Bucket Settings
- **Name**: `face-images`
- **Public**: Yes (for easy access)
- **File Size Limit**: 5MB
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`

### File Naming Convention
```
{user_id}/{date}/{step}_{timestamp}.jpg
```

Example: `123e4567-e89b-12d3-a456-426614174000/2024-01-15/center_2024-01-15_14-30-25.jpg`

## Security Considerations

1. **Public Bucket**: The bucket is public for easy access. If you need private access, you can:
   - Make the bucket private
   - Use signed URLs for access
   - Implement authentication checks

2. **File Validation**: The system validates:
   - File size (max 5MB)
   - MIME type (images only)
   - User permissions

3. **Cleanup**: When users are deleted, their images are automatically removed from storage.

## Troubleshooting

### Images Not Displaying
1. Check if the storage bucket exists
2. Verify the bucket is public
3. Check the image URLs in the database
4. Ensure proper CORS settings

### Upload Failures
1. Check file size limits
2. Verify MIME type restrictions
3. Check Supabase storage quotas
4. Review browser console for errors

### Performance Issues
1. Enable CDN for faster image delivery
2. Optimize image sizes before upload
3. Use appropriate image formats (JPEG for photos)

## Benefits of This Migration

1. **Performance**: Images load faster from CDN
2. **Scalability**: Better handling of large files
3. **Cost**: More cost-effective storage
4. **Maintenance**: Easier to manage and backup
5. **Integration**: Better integration with Supabase ecosystem

## Next Steps

1. Test the migration thoroughly
2. Monitor storage usage and costs
3. Consider implementing image optimization
4. Set up automated backups if needed
5. Monitor performance improvements
