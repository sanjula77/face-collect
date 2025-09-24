'use client';

import { useEffect } from 'react';

/**
 * Component to initialize Supabase Storage on app startup
 */
export default function StorageInitializer() {
    useEffect(() => {
        // Initialize storage when the app starts
        // Use setTimeout to avoid blocking the main thread
        const initStorage = async () => {
            try {
                // Import storage functions dynamically to avoid SSR issues
                const { initializeStorage } = await import('../lib/storage');
                await initializeStorage();
                console.log('Storage initialized successfully');
            } catch (error) {
                console.warn('Storage initialization failed, but app will continue:', error);
                // Don't throw error to prevent app from crashing
            }
        };

        // Delay initialization to ensure app loads first
        setTimeout(initStorage, 2000);
    }, []);

    // This component doesn't render anything
    return null;
}
