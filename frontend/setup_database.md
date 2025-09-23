# Database Setup Instructions

## Step 1: Create the face_metadata table

You need to run the migration script in your Supabase database. Here are the steps:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase_migration.sql`
5. Click **Run** to execute the migration

### Option B: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to your project root
cd ..

# Run the migration
supabase db push
```

## Step 2: Verify the table was created

After running the migration, you can verify the table was created by:

1. Going to **Table Editor** in your Supabase dashboard
2. You should see the new `face_metadata` table
3. The table should have the following columns:
   - `id` (UUID, Primary Key)
   - `face_image_id` (UUID, Foreign Key to face_images)
   - `quality_overall` (VARCHAR)
   - `quality_face_size` (VARCHAR)
   - `quality_sharpness` (VARCHAR)
   - `quality_lighting` (VARCHAR)
   - `face_width` (INTEGER)
   - `face_height` (INTEGER)
   - `sharpness_variance` (DECIMAL)
   - `brightness_value` (DECIMAL)
   - `created_at` (TIMESTAMP)

## Step 3: Test the application

Once the table is created, the quality check system should work properly. Try:

1. Starting a new face capture session
2. Capturing images - you should see quality labels
3. Checking the admin panel to see quality data

## Troubleshooting

If you still get errors:

1. **Check table permissions**: Make sure your Supabase user has INSERT/UPDATE permissions on the `face_metadata` table
2. **Verify foreign key**: Ensure the `face_images` table exists and has the correct structure
3. **Check RLS policies**: If you have Row Level Security enabled, you may need to create policies for the `face_metadata` table

## Alternative: Quick Fix

If you want to temporarily disable quality metadata saving while you set up the database, you can comment out the metadata saving code in `IntegratedFaceCapture.tsx`:

```typescript
// Comment out this section temporarily:
/*
if (result.qualityMetrics) {
  await saveFaceMetadata({
    faceImageId: savedImage.id,
    qualityOverall: result.qualityMetrics.overall,
    qualityFaceSize: result.qualityMetrics.faceSize.level,
    qualitySharpness: result.qualityMetrics.sharpness.level,
    qualityLighting: result.qualityMetrics.lighting.level,
    faceWidth: result.qualityMetrics.faceSize.width,
    faceHeight: result.qualityMetrics.faceSize.height,
    sharpnessVariance: result.qualityMetrics.sharpness.variance,
    brightnessValue: result.qualityMetrics.lighting.brightness,
  });
}
*/
```

This will allow the app to work without quality metadata storage until you can set up the database table.
