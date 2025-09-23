/**
 * Quality Check System for Face Images
 * 
 * This module provides quality assessment for captured face images based on:
 * - Face size (bounding box width in pixels)
 * - Sharpness (Laplacian variance)
 * - Lighting (average brightness of the face region)
 */

// ============================================================================
// TYPES
// ============================================================================

export type QualityLevel = 'High' | 'Medium' | 'Low';

export interface QualityMetrics {
  faceSize: {
    width: number;
    height: number;
    level: QualityLevel;
  };
  sharpness: {
    variance: number;
    level: QualityLevel;
  };
  lighting: {
    brightness: number;
    level: QualityLevel;
  };
  overall: QualityLevel;
}

export interface QualityThresholds {
  faceSize: {
    high: number;    // minimum width for high quality
    medium: number;  // minimum width for medium quality
  };
  sharpness: {
    high: number;    // minimum variance for high quality
    medium: number;  // minimum variance for medium quality
  };
  lighting: {
    high: { min: number; max: number };    // ideal brightness range
    medium: { min: number; max: number };  // acceptable brightness range
  };
}

// ============================================================================
// QUALITY THRESHOLDS
// ============================================================================

const QUALITY_THRESHOLDS: QualityThresholds = {
  faceSize: {
    high: 200,    // Face width >= 200px is high quality
    medium: 120,  // Face width >= 120px is medium quality
  },
  sharpness: {
    high: 1000,   // Laplacian variance >= 1000 is high quality
    medium: 500,  // Laplacian variance >= 500 is medium quality
  },
  lighting: {
    high: { min: 80, max: 180 },    // Ideal brightness range
    medium: { min: 50, max: 220 },  // Acceptable brightness range
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert base64 image to ImageData
 */
function base64ToImageData(base64: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64;
  });
}

/**
 * Calculate Laplacian variance for sharpness assessment
 */
function calculateSharpness(imageData: ImageData, faceBox?: { x: number; y: number; width: number; height: number }): number {
  const { data, width, height } = imageData;
  
  // If face box is provided, only analyze the face region
  let startX = 0, startY = 0, endX = width, endY = height;
  if (faceBox) {
    startX = Math.max(0, Math.floor(faceBox.x));
    startY = Math.max(0, Math.floor(faceBox.y));
    endX = Math.min(width, Math.floor(faceBox.x + faceBox.width));
    endY = Math.min(height, Math.floor(faceBox.y + faceBox.height));
  }
  
  let sum = 0;
  let count = 0;
  
  // Apply Laplacian kernel: [[0, -1, 0], [-1, 4, -1], [0, -1, 0]]
  for (let y = startY + 1; y < endY - 1; y++) {
    for (let x = startX + 1; x < endX - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Get surrounding pixels (grayscale)
      const center = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      const top = (data[((y - 1) * width + x) * 4] + data[((y - 1) * width + x) * 4 + 1] + data[((y - 1) * width + x) * 4 + 2]) / 3;
      const bottom = (data[((y + 1) * width + x) * 4] + data[((y + 1) * width + x) * 4 + 1] + data[((y + 1) * width + x) * 4 + 2]) / 3;
      const left = (data[(y * width + (x - 1)) * 4] + data[(y * width + (x - 1)) * 4 + 1] + data[(y * width + (x - 1)) * 4 + 2]) / 3;
      const right = (data[(y * width + (x + 1)) * 4] + data[(y * width + (x + 1)) * 4 + 1] + data[(y * width + (x + 1)) * 4 + 2]) / 3;
      
      const laplacian = Math.abs(4 * center - top - bottom - left - right);
      sum += laplacian * laplacian;
      count++;
    }
  }
  
  return count > 0 ? sum / count : 0;
}

/**
 * Calculate average brightness of a region
 */
function calculateBrightness(imageData: ImageData, faceBox?: { x: number; y: number; width: number; height: number }): number {
  const { data, width, height } = imageData;
  
  // If face box is provided, only analyze the face region
  let startX = 0, startY = 0, endX = width, endY = height;
  if (faceBox) {
    startX = Math.max(0, Math.floor(faceBox.x));
    startY = Math.max(0, Math.floor(faceBox.y));
    endX = Math.min(width, Math.floor(faceBox.x + faceBox.width));
    endY = Math.min(height, Math.floor(faceBox.y + faceBox.height));
  }
  
  let sum = 0;
  let count = 0;
  
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const idx = (y * width + x) * 4;
      // Calculate luminance using standard formula
      const luminance = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      sum += luminance;
      count++;
    }
  }
  
  return count > 0 ? sum / count : 0;
}

/**
 * Determine quality level based on value and thresholds
 */
function getQualityLevel(value: number, thresholds: { high: number; medium: number }): QualityLevel {
  if (value >= thresholds.high) return 'High';
  if (value >= thresholds.medium) return 'Medium';
  return 'Low';
}

/**
 * Determine lighting quality level based on brightness range
 */
function getLightingQualityLevel(brightness: number, thresholds: { high: { min: number; max: number }; medium: { min: number; max: number } }): QualityLevel {
  if (brightness >= thresholds.high.min && brightness <= thresholds.high.max) return 'High';
  if (brightness >= thresholds.medium.min && brightness <= thresholds.medium.max) return 'Medium';
  return 'Low';
}

/**
 * Calculate overall quality level
 * If any metric is "Low", final quality = Low
 * If at least one is "Medium", final quality = Medium
 * Only if all are "High", final quality = High
 */
function calculateOverallQuality(faceSizeLevel: QualityLevel, sharpnessLevel: QualityLevel, lightingLevel: QualityLevel): QualityLevel {
  const levels = [faceSizeLevel, sharpnessLevel, lightingLevel];
  
  if (levels.includes('Low')) return 'Low';
  if (levels.includes('Medium')) return 'Medium';
  return 'High';
}

// ============================================================================
// MAIN QUALITY CHECK FUNCTION
// ============================================================================

/**
 * Analyze image quality based on face detection results
 */
export async function analyzeImageQuality(
  imageData: string, // Base64 encoded image
  faceBox?: { x: number; y: number; width: number; height: number }
): Promise<QualityMetrics> {
  try {
    // Convert base64 to ImageData
    const imageDataObj = await base64ToImageData(imageData);
    
    // Calculate face size quality
    const faceWidth = faceBox?.width || imageDataObj.width;
    const faceHeight = faceBox?.height || imageDataObj.height;
    const faceSizeLevel = getQualityLevel(faceWidth, QUALITY_THRESHOLDS.faceSize);
    
    // Calculate sharpness quality
    const sharpnessVariance = calculateSharpness(imageDataObj, faceBox);
    const sharpnessLevel = getQualityLevel(sharpnessVariance, QUALITY_THRESHOLDS.sharpness);
    
    // Calculate lighting quality
    const brightness = calculateBrightness(imageDataObj, faceBox);
    const lightingLevel = getLightingQualityLevel(brightness, QUALITY_THRESHOLDS.lighting);
    
    // Calculate overall quality
    const overallLevel = calculateOverallQuality(faceSizeLevel, sharpnessLevel, lightingLevel);
    
    return {
      faceSize: {
        width: faceWidth,
        height: faceHeight,
        level: faceSizeLevel,
      },
      sharpness: {
        variance: sharpnessVariance,
        level: sharpnessLevel,
      },
      lighting: {
        brightness: brightness,
        level: lightingLevel,
      },
      overall: overallLevel,
    };
  } catch (error) {
    console.error('Error analyzing image quality:', error);
    
    // Return default low quality if analysis fails
    return {
      faceSize: {
        width: 0,
        height: 0,
        level: 'Low',
      },
      sharpness: {
        variance: 0,
        level: 'Low',
      },
      lighting: {
        brightness: 0,
        level: 'Low',
      },
      overall: 'Low',
    };
  }
}

/**
 * Get quality level color for UI display
 */
export function getQualityColor(level: QualityLevel): string {
  switch (level) {
    case 'High':
      return 'text-green-600 bg-green-100';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'Low':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Get quality level icon for UI display
 */
export function getQualityIcon(level: QualityLevel): string {
  switch (level) {
    case 'High':
      return '✅';
    case 'Medium':
      return '⚠️';
    case 'Low':
      return '❌';
    default:
      return '❓';
  }
}

/**
 * Get quality summary text for UI display
 */
export function getQualitySummary(metrics: QualityMetrics): string {
  const { faceSize, sharpness, lighting, overall } = metrics;
  
  const details = [
    `Face Size: ${faceSize.level} (${faceSize.width}px)`,
    `Sharpness: ${sharpness.level} (${Math.round(sharpness.variance)})`,
    `Lighting: ${lighting.level} (${Math.round(lighting.brightness)})`,
  ];
  
  return `Overall: ${overall} | ${details.join(' | ')}`;
}
