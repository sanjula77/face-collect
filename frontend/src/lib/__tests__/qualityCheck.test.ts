/**
 * Quality Check System Tests
 * 
 * This file contains tests for the quality check functionality
 */

import { analyzeImageQuality, getQualityColor, getQualityIcon, getQualitySummary } from '../qualityCheck';
import type { QualityMetrics } from '../qualityCheck';

// Mock canvas and image for testing
const mockImageData = {
  data: new Uint8ClampedArray(100 * 100 * 4), // 100x100 image
  width: 100,
  height: 100
};

// Mock base64 image (1x1 pixel PNG)
const mockBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

describe('Quality Check System', () => {
  describe('analyzeImageQuality', () => {
    it('should return quality metrics for a valid image', async () => {
      const faceBox = { x: 10, y: 10, width: 80, height: 80 };
      
      // Mock the base64ToImageData function
      const originalConsoleError = console.error;
      console.error = jest.fn(); // Suppress expected errors in test environment
      
      try {
        const result = await analyzeImageQuality(mockBase64Image, faceBox);
        
        expect(result).toBeDefined();
        expect(result.faceSize).toBeDefined();
        expect(result.sharpness).toBeDefined();
        expect(result.lighting).toBeDefined();
        expect(result.overall).toBeDefined();
        
        expect(['High', 'Medium', 'Low']).toContain(result.overall);
        expect(['High', 'Medium', 'Low']).toContain(result.faceSize.level);
        expect(['High', 'Medium', 'Low']).toContain(result.sharpness.level);
        expect(['High', 'Medium', 'Low']).toContain(result.lighting.level);
      } finally {
        console.error = originalConsoleError;
      }
    });

    it('should handle errors gracefully', async () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      try {
        const result = await analyzeImageQuality('invalid-base64', { x: 0, y: 0, width: 100, height: 100 });
        
        expect(result.overall).toBe('Low');
        expect(result.faceSize.level).toBe('Low');
        expect(result.sharpness.level).toBe('Low');
        expect(result.lighting.level).toBe('Low');
      } finally {
        console.error = originalConsoleError;
      }
    });
  });

  describe('getQualityColor', () => {
    it('should return correct colors for each quality level', () => {
      expect(getQualityColor('High')).toBe('text-green-600 bg-green-100');
      expect(getQualityColor('Medium')).toBe('text-yellow-600 bg-yellow-100');
      expect(getQualityColor('Low')).toBe('text-red-600 bg-red-100');
    });
  });

  describe('getQualityIcon', () => {
    it('should return correct icons for each quality level', () => {
      expect(getQualityIcon('High')).toBe('✅');
      expect(getQualityIcon('Medium')).toBe('⚠️');
      expect(getQualityIcon('Low')).toBe('❌');
    });
  });

  describe('getQualitySummary', () => {
    it('should return a formatted quality summary', () => {
      const mockMetrics: QualityMetrics = {
        faceSize: { width: 200, height: 200, level: 'High' },
        sharpness: { variance: 1200, level: 'High' },
        lighting: { brightness: 120, level: 'High' },
        overall: 'High'
      };

      const summary = getQualitySummary(mockMetrics);
      
      expect(summary).toContain('Overall: High');
      expect(summary).toContain('Face Size: High (200px)');
      expect(summary).toContain('Sharpness: High (1200)');
      expect(summary).toContain('Lighting: High (120)');
    });
  });
});
