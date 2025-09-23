# Quality Check Features

This document describes the new quality check system implemented for the face data collection project.

## Overview

The quality check system automatically analyzes captured face images and provides quality assessments based on three key metrics:

1. **Face Size** - Measures the bounding box width in pixels
2. **Sharpness** - Calculates Laplacian variance to assess image clarity
3. **Lighting** - Analyzes average brightness of the face region

## Quality Levels

Each metric is rated as **High**, **Medium**, or **Low** quality:

### Face Size
- **High**: Face width ≥ 200px
- **Medium**: Face width ≥ 120px
- **Low**: Face width < 120px

### Sharpness
- **High**: Laplacian variance ≥ 1000
- **Medium**: Laplacian variance ≥ 500
- **Low**: Laplacian variance < 500

### Lighting
- **High**: Brightness between 80-180 (ideal range)
- **Medium**: Brightness between 50-220 (acceptable range)
- **Low**: Brightness outside 50-220 range

### Overall Quality
- **High**: All metrics are High
- **Medium**: At least one metric is Medium (but none are Low)
- **Low**: Any metric is Low

## Database Schema

### New Table: `face_metadata`

```sql
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
```

## User Interface Features

### Capture Preview
- Quality labels displayed below each captured thumbnail
- Color-coded badges: Green (High), Yellow (Medium), Red (Low)
- Icons: ✅ (High), ⚠️ (Medium), ❌ (Low)

### Success Messages
- Quality summary shown after each capture
- Overall quality displayed with appropriate icon and color

### Admin Panel Enhancements

#### Images Tab
- **Quality Filter Dropdown**: Filter by High/Medium/Low quality
- **Quality Column**: Color-coded quality badges for each image
- **Quality Details**: Face size, sharpness, and lighting metrics
- **Download Links**: Direct download of images with quality info

#### Quality Display
- **Table View**: Comprehensive table with user info, quality, and metrics
- **Grid View**: Visual cards with quality overlays on images
- **Color Coding**: Consistent green/yellow/red color scheme throughout

## Technical Implementation

### Core Files

1. **`/lib/qualityCheck.ts`** - Main quality analysis engine
2. **`/lib/database.ts`** - Updated with metadata storage functions
3. **`/components/EasyFaceCapture.tsx`** - Integrated quality checking
4. **`/components/IntegratedFaceCapture.tsx`** - Quality metadata storage
5. **`/app/admin/page.tsx`** - Enhanced admin panel with quality features

### Key Functions

- `analyzeImageQuality()` - Main quality analysis function
- `saveFaceMetadata()` - Store quality data in database
- `getAllFaceImagesWithMetadata()` - Retrieve images with quality info
- `getQualityColor()` / `getQualityIcon()` - UI helper functions

## Usage

### For Users
1. Capture face images as usual
2. Quality is automatically analyzed and displayed
3. See quality feedback in real-time during capture
4. View quality summary upon completion

### For Admins
1. Navigate to Admin Panel → Images tab
2. Use quality filter dropdown to view specific quality levels
3. View detailed quality metrics for each image
4. Download images with quality information
5. Monitor overall data quality across all captures

## Quality Thresholds (Configurable)

The quality thresholds can be adjusted in `/lib/qualityCheck.ts`:

```typescript
const QUALITY_THRESHOLDS: QualityThresholds = {
  faceSize: {
    high: 200,    // Minimum width for high quality
    medium: 120,  // Minimum width for medium quality
  },
  sharpness: {
    high: 1000,   // Minimum variance for high quality
    medium: 500,  // Minimum variance for medium quality
  },
  lighting: {
    high: { min: 80, max: 180 },    // Ideal brightness range
    medium: { min: 50, max: 220 },  // Acceptable brightness range
  },
};
```

## Benefits

1. **Data Quality Assurance**: Automatic assessment of captured images
2. **User Feedback**: Real-time quality feedback during capture
3. **Admin Insights**: Comprehensive quality monitoring and filtering
4. **Research Value**: High-quality dataset for ML training
5. **User Experience**: Clear visual indicators and guidance

## Future Enhancements

- Quality-based retry suggestions
- Batch quality analysis for existing images
- Quality trend analytics
- Custom quality thresholds per project
- Quality-based image preprocessing recommendations
