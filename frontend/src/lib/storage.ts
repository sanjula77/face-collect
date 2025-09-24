/**
 * Supabase Storage Functions
 * 
 * This file contains functions for uploading and managing images in Supabase Storage
 */

import { supabase } from './supabaseClient';

// ============================================================================
// STORAGE CONFIGURATION
// ============================================================================

const BUCKET_NAME = 'faces';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

/**
 * Convert base64 image data to File object
 */
function base64ToFile(base64Data: string, filename: string, mimeType: string = 'image/jpeg'): File {
  // Remove data URL prefix if present
  const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
  
  // Convert base64 to binary
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: mimeType });
}

/**
 * Generate a unique filename for the image
 */
function generateImageFilename(userId: string, step: string, timestamp: number): string {
  const date = new Date(timestamp);
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = date.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-'); // HH-MM-SS
  
  return `${userId}/${dateStr}/${step.toLowerCase()}_${timeStr}.jpg`;
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImageToStorage(
  base64Data: string,
  userId: string,
  step: 'Center' | 'Left' | 'Right' | 'Up' | 'Down',
  timestamp: number = Date.now()
): Promise<{ url: string; path: string; size: number }> {
  try {
    // Convert base64 to file
    const filename = generateImageFilename(userId, step, timestamp);
    const file = base64ToFile(base64Data, filename);
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size ${file.size} exceeds maximum allowed size of ${MAX_FILE_SIZE} bytes`);
    }
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      });
    
    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);
    
    return {
      url: urlData.publicUrl,
      path: data.path,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading image to storage:', error);
    throw error;
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImageFromStorage(imagePath: string): Promise<void> {
  try {
    if (!imagePath || imagePath.trim() === '') {
      return;
    }
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([imagePath]);
    
    if (error) {
      // Don't throw error if file doesn't exist (already deleted)
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        return;
      }
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    throw error;
  }
}

/**
 * Delete all images for a user from Supabase Storage
 */
export async function deleteAllUserImages(userId: string): Promise<void> {
  try {
    // List all files in the user's folder
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId, {
        limit: 1000, // Get all files
        offset: 0
      });
    
    if (listError) {
      // If folder doesn't exist, that's fine
      if (listError.message.includes('not found') || listError.message.includes('does not exist')) {
        return;
      }
      throw new Error(`Failed to list user images: ${listError.message}`);
    }
    
    if (!files || files.length === 0) {
      return;
    }
    
    // Get all file paths
    const filePaths = files.map(file => `${userId}/${file.name}`);
    
    // Also check for subdirectories (date folders)
    const subdirs = files.filter(file => file.metadata?.mimetype === 'application/folder' || file.name.includes('-'));
    
    for (const subdir of subdirs) {
      try {
        const { data: subdirFiles, error: subdirError } = await supabase.storage
          .from(BUCKET_NAME)
          .list(`${userId}/${subdir.name}`, {
            limit: 1000,
            offset: 0
          });
        
        if (!subdirError && subdirFiles && subdirFiles.length > 0) {
          const subdirPaths = subdirFiles.map(file => `${userId}/${subdir.name}/${file.name}`);
          filePaths.push(...subdirPaths);
        }
      } catch {
        // Continue if subdirectory listing fails
      }
    }
    
    if (filePaths.length === 0) {
      return;
    }
    
    // Delete all files in parallel
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);
    
    if (deleteError) {
      throw new Error(`Failed to delete user images: ${deleteError.message}`);
    }
  } catch (error) {
    console.error('Error deleting all user images:', error);
    throw error;
  }
}

/**
 * Get signed URL for private access (if needed)
 */
export async function getSignedUrl(imagePath: string, expiresIn: number = 3600): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(imagePath, expiresIn);
    
    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error creating signed URL:', error);
    throw error;
  }
}

/**
 * Clean up orphaned images (images in storage but not in database)
 */
export async function cleanupOrphanedImages(): Promise<{ deleted: number; errors: string[] }> {
  try {
    // Get all users from database
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id');
    
    if (usersError) {
      throw new Error(`Failed to get users: ${usersError.message}`);
    }
    
    const userIds = users?.map(user => user.id) || [];
    
    // List all folders in storage
    const { data: storageFolders, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        offset: 0
      });
    
    if (listError) {
      throw new Error(`Failed to list storage folders: ${listError.message}`);
    }
    
    const orphanedFolders = storageFolders?.filter(folder => 
      folder.name && !userIds.includes(folder.name)
    ) || [];
    
    let deletedCount = 0;
    const errors: string[] = [];
    
    // Delete orphaned folders
    for (const folder of orphanedFolders) {
      try {
        await deleteAllUserImages(folder.name);
        deletedCount++;
      } catch (error) {
        const errorMsg = `Failed to delete orphaned folder ${folder.name}: ${error}`;
        errors.push(errorMsg);
      }
    }
    
    return { deleted: deletedCount, errors };
  } catch (error) {
    console.error('Error during orphaned images cleanup:', error);
    throw error;
  }
}

/**
 * List images for a user
 */
export async function listUserImages(userId: string): Promise<{ name: string; size: number; lastModified: string }[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error) {
      throw new Error(`Failed to list images: ${error.message}`);
    }
    
    // Transform FileObject to expected format
    return (data || []).map(file => ({
      name: file.name,
      size: file.metadata?.size || 0,
      lastModified: file.updated_at || file.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error listing user images:', error);
    throw error;
  }
}

/**
 * Check if storage bucket exists and create if needed
 */
export async function ensureStorageBucket(): Promise<void> {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.warn(`Failed to list buckets: ${listError.message}`);
      // Don't throw error, just continue - bucket might exist but we can't list it
      return;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`Bucket ${BUCKET_NAME} not found, attempting to create...`);
      
      // Create bucket
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make bucket public for easy access
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: MAX_FILE_SIZE
      });
      
      if (createError) {
        // If bucket creation fails due to RLS or already exists, that's okay
        if (createError.message.includes('row-level security') || 
            createError.message.includes('already exists') ||
            createError.message.includes('duplicate')) {
          console.log(`Bucket ${BUCKET_NAME} already exists or creation blocked by RLS (this is normal)`);
          return;
        }
        throw new Error(`Failed to create bucket: ${createError.message}`);
      }
      
      console.log(`Created storage bucket: ${BUCKET_NAME}`);
    } else {
      console.log(`Storage bucket ${BUCKET_NAME} already exists`);
    }
  } catch (error) {
    console.warn('Error ensuring storage bucket (continuing anyway):', error);
    // Don't throw error to prevent app from crashing
    // The bucket might exist but we can't verify it due to permissions
  }
}

/**
 * Initialize storage system - call this when the app starts
 */
export async function initializeStorage(): Promise<void> {
  try {
    await ensureStorageBucket();
    console.log('Storage system initialized successfully');
  } catch (error) {
    console.warn('Storage initialization had issues, but continuing:', error);
    // Don't throw error to prevent app from crashing
    // The system will still work, but images might not be uploaded to storage
  }
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface StorageUploadResult {
  url: string;
  path: string;
  size: number;
}

export interface StorageImageInfo {
  name: string;
  size: number;
  lastModified: string;
}
