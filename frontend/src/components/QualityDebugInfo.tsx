"use client";

import { useState, useEffect } from "react";
import { getUserFaceImagesWithMetadata } from "@/lib/database";

interface QualityDebugInfoProps {
    userId: string;
}

/**
 * Debug component to help troubleshoot quality data issues
 */
export default function QualityDebugInfo({ userId }: QualityDebugInfoProps) {
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDebugInfo = async () => {
            try {
                const images = await getUserFaceImagesWithMetadata(userId);
                setDebugInfo({
                    totalImages: images.length,
                    imagesWithMetadata: images.filter(img => img.metadata).length,
                    imagesWithoutMetadata: images.filter(img => !img.metadata).length,
                    sampleImage: images[0] || null,
                    allImages: images
                });
            } catch (error) {
                console.error('Debug info error:', error);
                setDebugInfo({ error: error.message });
            } finally {
                setLoading(false);
            }
        };

        loadDebugInfo();
    }, [userId]);

    if (loading) {
        return <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">Loading debug info...</div>;
    }

    if (debugInfo?.error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800">Debug Error</h3>
                <p className="text-red-700">{debugInfo.error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Quality Data Debug Info</h3>
            <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Total Images:</strong> {debugInfo?.totalImages}</p>
                <p><strong>Images with Quality Data:</strong> {debugInfo?.imagesWithMetadata}</p>
                <p><strong>Images without Quality Data:</strong> {debugInfo?.imagesWithoutMetadata}</p>

                {debugInfo?.sampleImage && (
                    <div className="mt-3">
                        <p><strong>Sample Image:</strong></p>
                        <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                            {JSON.stringify({
                                id: debugInfo.sampleImage.id,
                                step: debugInfo.sampleImage.step,
                                hasMetadata: !!debugInfo.sampleImage.metadata,
                                metadata: debugInfo.sampleImage.metadata
                            }, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
