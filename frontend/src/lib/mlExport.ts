/**
 * ML Export System for Face Recognition Training Data
 * 
 * This module provides functions to export collected face data
 * in formats suitable for machine learning training.
 */

import { getUsers, getUserFaceImages, getCaptureSessions } from './database';

// ============================================================================
// TYPES
// ============================================================================

export interface MLTrainingData {
  dataset_info: {
    total_users: number;
    total_images: number;
    total_sessions: number;
    export_date: string;
    demographics: {
      age_groups: Record<string, number>;
      gender_distribution: Record<string, number>;
    };
  };
  users: Array<{
    user_id: string;
    name: string;
    age: number;
    gender: string;
    images: Array<{
      image_id: string;
      step: string;
      image_url: string; // URL to image in Supabase Storage
      storage_path: string; // Path in storage bucket
      width: number;
      height: number;
      quality_score: number;
      metadata: any;
    }>;
  }>;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'zip';
  include_images: boolean;
  quality_threshold: number;
  max_images_per_user?: number;
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Export all face data for ML training
 */
export async function exportMLTrainingData(options: ExportOptions = {
  format: 'json',
  include_images: true,
  quality_threshold: 0.5
}): Promise<MLTrainingData> {
  try {
    // Get all users
    const { users } = await getUsers(1, 1000); // Get all users
    
    // Get all sessions for statistics
    const { sessions } = await getCaptureSessions(1, 1000);
    
    const mlData: MLTrainingData = {
      dataset_info: {
        total_users: users.length,
        total_images: 0,
        total_sessions: sessions.length,
        export_date: new Date().toISOString(),
        demographics: {
          age_groups: {},
          gender_distribution: {}
        }
      },
      users: []
    };

    // Process each user
    for (const user of users) {
      const userImages = await getUserFaceImages(user.id);
      
      // Filter by quality threshold (using confidence_score as quality indicator)
      const filteredImages = userImages.filter(img => 
        (img.metadata?.confidence_score || 0) >= options.quality_threshold
      );

      // Limit images per user if specified
      const limitedImages = options.max_images_per_user 
        ? filteredImages.slice(0, options.max_images_per_user)
        : filteredImages;

      // Update statistics
      mlData.dataset_info.total_images += limitedImages.length;
      
      // Update demographics
      const ageGroup = getAgeGroup(user.age);
      mlData.dataset_info.demographics.age_groups[ageGroup] = 
        (mlData.dataset_info.demographics.age_groups[ageGroup] || 0) + 1;
      
      mlData.dataset_info.demographics.gender_distribution[user.gender] = 
        (mlData.dataset_info.demographics.gender_distribution[user.gender] || 0) + 1;

      // Add user data
      mlData.users.push({
        user_id: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        images: limitedImages.map(img => ({
          image_id: img.id,
          step: img.step,
          image_url: img.image_url,
          storage_path: img.storage_path,
          width: img.width,
          height: img.height,
          quality_score: img.metadata?.confidence_score || 0,
          metadata: img.metadata
        }))
      });
    }

    return mlData;
  } catch (error) {
    console.error('Error exporting ML training data:', error);
    throw error;
  }
}

/**
 * Export data in different formats
 */
export async function exportDataInFormat(
  format: 'json' | 'csv' | 'zip',
  options: ExportOptions
): Promise<Blob> {
  const mlData = await exportMLTrainingData(options);

  switch (format) {
    case 'json':
      return new Blob([JSON.stringify(mlData, null, 2)], { type: 'application/json' });
    
    case 'csv':
      return exportToCSV(mlData);
    
    case 'zip':
      return exportToZIP(mlData, options);
    
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Export to CSV format
 */
function exportToCSV(mlData: MLTrainingData): Blob {
  const csvRows: string[] = [];
  
  // Header
  csvRows.push('user_id,name,age,gender,image_id,step,image_url,storage_path,width,height,quality_score');
  
  // Data rows
  mlData.users.forEach(user => {
    user.images.forEach(image => {
      csvRows.push([
        user.user_id,
        user.name,
        user.age,
        user.gender,
        image.image_id,
        image.step,
        image.image_url,
        image.storage_path,
        image.width,
        image.height,
        image.quality_score
      ].join(','));
    });
  });
  
  return new Blob([csvRows.join('\n')], { type: 'text/csv' });
}

/**
 * Export to ZIP format with images
 */
async function exportToZIP(mlData: MLTrainingData, options: ExportOptions): Promise<Blob> {
  // This would require a ZIP library like JSZip
  // For now, return JSON with base64 images
  return new Blob([JSON.stringify(mlData, null, 2)], { type: 'application/json' });
}

/**
 * Get age group for demographics
 */
function getAgeGroup(age: number): string {
  if (age < 18) return 'under_18';
  if (age < 25) return '18_24';
  if (age < 35) return '25_34';
  if (age < 45) return '35_44';
  if (age < 55) return '45_54';
  if (age < 65) return '55_64';
  return '65_plus';
}

/**
 * Download exported data
 */
export function downloadExportedData(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get dataset statistics
 */
export async function getDatasetStatistics(): Promise<{
  total_users: number;
  total_images: number;
  total_sessions: number;
  average_images_per_user: number;
  demographics: {
    age_groups: Record<string, number>;
    gender_distribution: Record<string, number>;
  };
  quality_distribution: {
    high_quality: number;
    medium_quality: number;
    low_quality: number;
  };
}> {
  try {
    const { users } = await getUsers(1, 1000);
    const { sessions } = await getCaptureSessions(1, 1000);
    
    let totalImages = 0;
    const demographics = {
      age_groups: {} as Record<string, number>,
      gender_distribution: {} as Record<string, number>
    };
    
    const qualityDistribution = {
      high_quality: 0,
      medium_quality: 0,
      low_quality: 0
    };

    for (const user of users) {
      const userImages = await getUserFaceImages(user.id);
      totalImages += userImages.length;
      
      // Demographics
      const ageGroup = getAgeGroup(user.age);
      demographics.age_groups[ageGroup] = (demographics.age_groups[ageGroup] || 0) + 1;
      demographics.gender_distribution[user.gender] = (demographics.gender_distribution[user.gender] || 0) + 1;
      
      // Quality distribution
      userImages.forEach(img => {
        const quality = img.metadata?.confidence_score || 0;
        if (quality >= 0.8) qualityDistribution.high_quality++;
        else if (quality >= 0.5) qualityDistribution.medium_quality++;
        else qualityDistribution.low_quality++;
      });
    }

    return {
      total_users: users.length,
      total_images: totalImages,
      total_sessions: sessions.length,
      average_images_per_user: users.length > 0 ? totalImages / users.length : 0,
      demographics,
      quality_distribution: qualityDistribution
    };
  } catch (error) {
    console.error('Error getting dataset statistics:', error);
    throw error;
  }
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

// Types are already exported above
