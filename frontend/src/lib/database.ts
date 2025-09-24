/**
 * Database Schema and Storage Functions
 * 
 * This file contains the database schema definitions and storage functions
 * for the face collection system using Supabase.
 */

import { supabase } from './supabaseClient';

// ============================================================================
// DATABASE SCHEMA TYPES
// ============================================================================

export interface UserRecord {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  created_at: string;
  updated_at: string;
  status: 'active' | 'archived' | 'deleted';
}

export interface FaceImageRecord {
  id: string;
  user_id: string;
  step: 'Center' | 'Left' | 'Right' | 'Up' | 'Down';
  image_url: string; // URL to image in Supabase Storage
  storage_path: string; // Path in storage bucket
  file_size: number;
  width: number;
  height: number;
  created_at: string;
  metadata?: {
    face_detected: boolean;
    confidence_score?: number;
    processing_time?: number;
  };
}

export interface FaceMetadataRecord {
  id: string;
  face_image_id: string;
  quality_overall: 'High' | 'Medium' | 'Low';
  quality_face_size: 'High' | 'Medium' | 'Low';
  quality_sharpness: 'High' | 'Medium' | 'Low';
  quality_lighting: 'High' | 'Medium' | 'Low';
  face_width: number;
  face_height: number;
  sharpness_variance: number;
  brightness_value: number;
  created_at: string;
}

export interface CaptureSessionRecord {
  id: string;
  user_id: string;
  status: 'in_progress' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  total_images: number;
  successful_images: number;
  failed_images: number;
  session_metadata?: {
    device_info?: string;
    browser_info?: string;
    ip_address?: string;
    user_agent?: string;
  };
}

// ============================================================================
// DATABASE SCHEMA SQL (for reference)
// ============================================================================

/*
-- Users table (simplified - only name, age, gender)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 120),
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted'))
);

-- Face images table
CREATE TABLE face_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step VARCHAR(10) NOT NULL CHECK (step IN ('Center', 'Left', 'Right', 'Up', 'Down')),
  image_url TEXT NOT NULL, -- URL to image in Supabase Storage
  storage_path TEXT NOT NULL, -- Path in storage bucket
  file_size INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Face metadata table for quality assessment
CREATE TABLE face_metadata (
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

-- Capture sessions table
CREATE TABLE capture_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('in_progress', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_images INTEGER DEFAULT 0,
  successful_images INTEGER DEFAULT 0,
  failed_images INTEGER DEFAULT 0,
  session_metadata JSONB
);

-- Indexes for better performance
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_face_images_user_id ON face_images(user_id);
CREATE INDEX idx_face_images_step ON face_images(step);
CREATE INDEX idx_face_metadata_face_image_id ON face_metadata(face_image_id);
CREATE INDEX idx_face_metadata_quality_overall ON face_metadata(quality_overall);
CREATE INDEX idx_capture_sessions_user_id ON capture_sessions(user_id);
CREATE INDEX idx_capture_sessions_status ON capture_sessions(status);
*/

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

/**
 * Create a new user record
 */
export async function createUser(userData: Omit<UserRecord, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<UserRecord> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...userData,
        status: 'active'
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<UserRecord | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

/**
 * Get all users with pagination
 */
export async function getUsers(page: number = 1, limit: number = 20): Promise<{ users: UserRecord[], total: number }> {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }

    return {
      users: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

/**
 * Create a new capture session
 */
export async function createCaptureSession(userId: string, metadata?: any): Promise<CaptureSessionRecord> {
  try {
    const { data, error } = await supabase
      .from('capture_sessions')
      .insert([{
        user_id: userId,
        status: 'in_progress',
        session_metadata: metadata
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create capture session: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating capture session:', error);
    throw error;
  }
}

/**
 * Update capture session status
 */
export async function updateCaptureSession(
  sessionId: string, 
  updates: Partial<Pick<CaptureSessionRecord, 'status' | 'completed_at' | 'total_images' | 'successful_images' | 'failed_images'>>
): Promise<CaptureSessionRecord> {
  try {
    const { data, error } = await supabase
      .from('capture_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update capture session: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating capture session:', error);
    throw error;
  }
}

/**
 * Save face image to database (with storage URL)
 */
export async function saveFaceImage(imageData: {
  userId: string;
  sessionId: string;
  step: 'Center' | 'Left' | 'Right' | 'Up' | 'Down';
  imageUrl: string; // URL to image in Supabase Storage
  storagePath?: string; // Path in storage bucket (optional for backward compatibility)
  fileSize: number;
  width: number;
  height: number;
  metadata?: any;
}): Promise<FaceImageRecord> {
  try {
    // Try to insert with storage_path first (new schema)
    const insertData: any = {
      user_id: imageData.userId,
      step: imageData.step,
      image_url: imageData.imageUrl,
      image_data: imageData.imageUrl, // Required field - use URL as fallback
      file_size: imageData.fileSize,
      width: imageData.width,
      height: imageData.height,
      metadata: imageData.metadata
    };

    // Add storage_path if provided and not empty
    if (imageData.storagePath && imageData.storagePath.trim() !== '') {
      insertData.storage_path = imageData.storagePath;
    }

    let data, error;
    try {
      const result = await supabase
        .from('face_images')
        .insert([insertData])
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } catch (insertError) {
      console.error('Exception during database insert:', insertError);
      throw new Error(`Database insert exception: ${insertError instanceof Error ? insertError.message : 'Unknown error'}`);
    }

    if (error) {
      // If storage_path column doesn't exist, try without it
      if (error.message && (error.message.includes('storage_path') || error.message.includes('column'))) {
        const fallbackData = {
          user_id: imageData.userId,
          step: imageData.step,
          image_url: imageData.imageUrl,
          image_data: imageData.imageUrl, // Use URL as fallback for image_data
          file_size: imageData.fileSize,
          width: imageData.width,
          height: imageData.height,
          metadata: imageData.metadata
        };

        const { data: fallbackResult, error: fallbackError } = await supabase
          .from('face_images')
          .insert([fallbackData])
          .select()
          .single();

        if (fallbackError) {
          throw new Error(`Failed to save face image (fallback): ${fallbackError.message}`);
        }

        return fallbackResult;
      }
      
      throw new Error(`Failed to save face image: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error saving face image:', error);
    throw error;
  }
}

/**
 * Save face metadata to database
 */
export async function saveFaceMetadata(metadataData: {
  faceImageId: string;
  qualityOverall: 'High' | 'Medium' | 'Low';
  qualityFaceSize: 'High' | 'Medium' | 'Low';
  qualitySharpness: 'High' | 'Medium' | 'Low';
  qualityLighting: 'High' | 'Medium' | 'Low';
  faceWidth: number;
  faceHeight: number;
  sharpnessVariance: number;
  brightnessValue: number;
}): Promise<FaceMetadataRecord> {
  try {
    const { data, error } = await supabase
      .from('face_metadata')
      .insert([{
        face_image_id: metadataData.faceImageId,
        quality_overall: metadataData.qualityOverall,
        quality_face_size: metadataData.qualityFaceSize,
        quality_sharpness: metadataData.qualitySharpness,
        quality_lighting: metadataData.qualityLighting,
        face_width: metadataData.faceWidth,
        face_height: metadataData.faceHeight,
        sharpness_variance: metadataData.sharpnessVariance,
        brightness_value: metadataData.brightnessValue,
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save face metadata: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error saving face metadata:', error);
    throw error;
  }
}

/**
 * Get face images for a user
 */
export async function getUserFaceImages(userId: string): Promise<FaceImageRecord[]> {
  try {
    const { data, error } = await supabase
      .from('face_images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to get face images: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error getting face images:', error);
    throw error;
  }
}

/**
 * Get face images with metadata for a user
 */
export async function getUserFaceImagesWithMetadata(userId: string): Promise<(FaceImageRecord & { metadata: FaceMetadataRecord | null })[]> {
  try {
    const { data, error } = await supabase
      .from('face_images')
      .select(`
        *,
        metadata:face_metadata(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to get face images with metadata: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error getting face images with metadata:', error);
    throw error;
  }
}

/**
 * Get all face images with metadata and user info for admin panel
 */
export async function getAllFaceImagesWithMetadata(page: number = 1, limit: number = 20, qualityFilter?: 'High' | 'Medium' | 'Low'): Promise<{
  images: (FaceImageRecord & { 
    user: UserRecord; 
    metadata: FaceMetadataRecord | null;
  })[];
  total: number;
}> {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('face_images')
      .select(`
        *,
        user:users(*),
        metadata:face_metadata(*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply quality filter if provided
    if (qualityFilter) {
      query = query.eq('metadata.quality_overall', qualityFilter);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to get face images with metadata: ${error.message}`);
    }

    return {
      images: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error getting face images with metadata:', error);
    throw error;
  }
}

/**
 * Get capture session with images
 */
export async function getCaptureSessionWithImages(sessionId: string): Promise<{
  session: CaptureSessionRecord;
  user: UserRecord;
  images: FaceImageRecord[];
} | null> {
  try {
    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('capture_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      if (sessionError.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get capture session: ${sessionError.message}`);
    }

    // Get user
    const user = await getUserById(session.user_id);
    if (!user) {
      throw new Error('User not found for session');
    }

    // Get images
    const images = await getUserFaceImages(session.user_id);

    return {
      session,
      user,
      images
    };
  } catch (error) {
    console.error('Error getting capture session with images:', error);
    throw error;
  }
}

/**
 * Get all capture sessions with pagination
 */
export async function getCaptureSessions(page: number = 1, limit: number = 20): Promise<{
  sessions: (CaptureSessionRecord & { user: UserRecord })[];
  total: number;
}> {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('capture_sessions')
      .select(`
        *,
        user:users(*)
      `)
      .order('started_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to get capture sessions: ${error.message}`);
    }

    return {
      sessions: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error getting capture sessions:', error);
    throw error;
  }
}

/**
 * Delete user and all associated data
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    // First, get all face images for this user to delete from storage
    const { data: faceImages, error: imagesError } = await supabase
      .from('face_images')
      .select('storage_path, image_url')
      .eq('user_id', userId);

    if (imagesError) {
      throw new Error(`Failed to get face images: ${imagesError.message}`);
    }

    // Delete images from storage
    const { deleteAllUserImages } = await import('./storage');
    
    try {
      await deleteAllUserImages(userId);
    } catch (storageError) {
      console.error('Storage deletion failed:', storageError);
      
      // Fallback: try individual image deletion if we have storage paths
      if (faceImages && faceImages.length > 0) {
        const { deleteImageFromStorage } = await import('./storage');
        
        const validStoragePaths = faceImages
          .map(img => img.storage_path)
          .filter(path => path && path.trim() !== '');
        
        if (validStoragePaths.length > 0) {
          await Promise.all(
            validStoragePaths.map(path => 
              deleteImageFromStorage(path).catch(err => 
                console.warn(`Failed to delete individual image: ${path}`, err)
              )
            )
          );
        }
      }
    }

    // Delete user record - this will cascade delete all related records due to foreign key constraints
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  totalUsers: number;
  totalSessions: number;
  totalImages: number;
  completedSessions: number;
  failedSessions: number;
}> {
  try {
    const [
      { count: totalUsers },
      { count: totalSessions },
      { count: totalImages },
      { count: completedSessions },
      { count: failedSessions }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('capture_sessions').select('*', { count: 'exact', head: true }),
      supabase.from('face_images').select('*', { count: 'exact', head: true }),
      supabase.from('capture_sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('capture_sessions').select('*', { count: 'exact', head: true }).eq('status', 'failed')
    ]);

    return {
      totalUsers: totalUsers || 0,
      totalSessions: totalSessions || 0,
      totalImages: totalImages || 0,
      completedSessions: completedSessions || 0,
      failedSessions: failedSessions || 0
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

// Types are already exported as interfaces above, no need to re-export
