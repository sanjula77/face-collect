"use client";

import { useState, useEffect } from "react";
import { exportMLTrainingData, exportDataInFormat, downloadExportedData, getDatasetStatistics } from "@/lib/mlExport";
import type { MLTrainingData, ExportOptions } from "@/lib/mlExport";

/**
 * ML Export Page: Export face data for machine learning training
 * 
 * Features:
 * - Dataset statistics
 * - Export in multiple formats (JSON, CSV, ZIP)
 * - Quality filtering
 * - Mobile-optimized interface
 */

export default function MLExportPage() {
  
  // State
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    include_images: true,
    quality_threshold: 0.5,
    max_images_per_user: undefined
  });

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadStats = async () => {
    try {
      setLoading(true);
      const statistics = await getDatasetStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ============================================================================
  // EXPORT HANDLERS
  // ============================================================================

  const handleExport = async () => {
    try {
      setExporting(true);
      
      const blob = await exportDataInFormat(exportOptions.format, exportOptions);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `face_dataset_${timestamp}.${exportOptions.format}`;
      
      downloadExportedData(blob, filename);
      
      // Show success message
      alert(`Dataset exported successfully as ${filename}`);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export dataset. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high_quality': return 'text-green-600';
      case 'medium_quality': return 'text-yellow-600';
      case 'low_quality': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Loading Dataset Statistics...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a href="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Admin</span>
              </a>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-800">ML Export</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Face Recognition Training</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Dataset Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Dataset Statistics</h2>
            
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatNumber(stats.total_users)}
                  </div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatNumber(stats.total_images)}
                  </div>
                  <div className="text-sm text-gray-600">Total Images</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats.average_images_per_user.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Images/User</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {formatNumber(stats.total_sessions)}
                  </div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
              </div>
            )}
          </div>

          {/* Demographics */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Groups */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Age Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(stats.demographics.age_groups).map(([ageGroup, count]) => (
                    <div key={ageGroup} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">
                        {ageGroup.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {formatNumber(count as number)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gender Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(stats.demographics.gender_distribution).map(([gender, count]) => (
                    <div key={gender} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">
                        {gender}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {formatNumber(count as number)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quality Distribution */}
          {stats && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Image Quality Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(stats.quality_distribution).map(([quality, count]) => (
                  <div key={quality} className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${getQualityColor(quality)}`}>
                      {formatNumber(count as number)}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {quality.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Export Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={exportOptions.format}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="json">JSON (Recommended)</option>
                  <option value="csv">CSV</option>
                  <option value="zip">ZIP Archive</option>
                </select>
              </div>

              {/* Quality Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Threshold: {exportOptions.quality_threshold}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={exportOptions.quality_threshold}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, quality_threshold: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low (0.0)</span>
                  <span>High (1.0)</span>
                </div>
              </div>

              {/* Include Images */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.include_images}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, include_images: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Include Image Data</span>
                </label>
              </div>

              {/* Max Images Per User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Images Per User (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={exportOptions.max_images_per_user || ''}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    max_images_per_user: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="No limit"
                />
              </div>
            </div>

            {/* Export Button */}
            <div className="mt-6">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Dataset
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Export Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Export Information</h3>
            <div className="text-blue-700 space-y-2">
              <p><strong>JSON Format:</strong> Complete dataset with metadata, recommended for ML training</p>
              <p><strong>CSV Format:</strong> Tabular data without images, good for analysis</p>
              <p><strong>ZIP Format:</strong> Compressed archive with images and metadata</p>
              <p><strong>Quality Threshold:</strong> Filters out low-quality images for better training results</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
