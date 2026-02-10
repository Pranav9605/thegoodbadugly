import { useState, useCallback, useRef, useEffect } from 'react';
import type { WritingMetadata } from '@/lib/database.types';

interface UseWritingMetricsReturn {
    metrics: WritingMetadata;
    startTracking: () => void;
    stopTracking: () => WritingMetadata;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    handlePaste: (e: React.ClipboardEvent) => void;
    resetMetrics: () => void;
}

export function useWritingMetrics(): UseWritingMetricsReturn {
    const [metrics, setMetrics] = useState<WritingMetadata>({
        time_spent_seconds: 0,
        session_breaks: 0,
        paste_attempts: 0,
        paste_character_count: 0,
        total_keystrokes: 0,
        backspace_count: 0,
        avg_words_per_minute: 0,
        revision_count: 0,
    });

    const startTimeRef = useRef<Date | null>(null);
    const isTrackingRef = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastVisibilityChangeRef = useRef<Date | null>(null);
    const wordCountRef = useRef(0);

    // Track visibility changes (tab switches)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (isTrackingRef.current) {
                if (document.hidden) {
                    lastVisibilityChangeRef.current = new Date();
                } else if (lastVisibilityChangeRef.current) {
                    setMetrics(prev => ({
                        ...prev,
                        session_breaks: (prev.session_breaks || 0) + 1
                    }));
                    lastVisibilityChangeRef.current = null;
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const startTracking = useCallback(() => {
        if (!isTrackingRef.current) {
            startTimeRef.current = new Date();
            isTrackingRef.current = true;

            setMetrics(prev => ({
                ...prev,
                started_at: new Date().toISOString()
            }));

            // Update time spent every second
            intervalRef.current = setInterval(() => {
                if (startTimeRef.current) {
                    const elapsed = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000);
                    setMetrics(prev => ({
                        ...prev,
                        time_spent_seconds: elapsed
                    }));
                }
            }, 1000);
        }
    }, []);

    const stopTracking = useCallback((): WritingMetadata => {
        isTrackingRef.current = false;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        const finalMetrics: WritingMetadata = {
            ...metrics,
            completed_at: new Date().toISOString()
        };

        // Calculate WPM if we have enough data
        if (finalMetrics.time_spent_seconds && finalMetrics.time_spent_seconds > 0) {
            const minutes = finalMetrics.time_spent_seconds / 60;
            if (minutes > 0 && wordCountRef.current > 0) {
                finalMetrics.avg_words_per_minute = Math.round(wordCountRef.current / minutes);
            }
        }

        return finalMetrics;
    }, [metrics]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Start tracking on first keystroke
        if (!isTrackingRef.current) {
            startTracking();
        }

        setMetrics(prev => ({
            ...prev,
            total_keystrokes: (prev.total_keystrokes || 0) + 1,
            backspace_count: e.key === 'Backspace'
                ? (prev.backspace_count || 0) + 1
                : prev.backspace_count
        }));
    }, [startTracking]);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        const pastedText = e.clipboardData.getData('text');

        setMetrics(prev => ({
            ...prev,
            paste_attempts: (prev.paste_attempts || 0) + 1,
            paste_character_count: (prev.paste_character_count || 0) + pastedText.length
        }));
    }, []);

    const resetMetrics = useCallback(() => {
        isTrackingRef.current = false;
        startTimeRef.current = null;
        wordCountRef.current = 0;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setMetrics({
            time_spent_seconds: 0,
            session_breaks: 0,
            paste_attempts: 0,
            paste_character_count: 0,
            total_keystrokes: 0,
            backspace_count: 0,
            avg_words_per_minute: 0,
            revision_count: 0,
        });
    }, []);

    // Expose a way to update word count for WPM calculation
    const updateWordCount = useCallback((content: string) => {
        wordCountRef.current = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    }, []);

    return {
        metrics,
        startTracking,
        stopTracking,
        handleKeyDown,
        handlePaste,
        resetMetrics,
    };
}

// Helper to calculate trust score from metrics
export function calculateTrustScore(metrics: WritingMetadata): 'high' | 'medium' | 'low' {
    let score = 0;

    // Time spent (longer is better)
    const minutes = (metrics.time_spent_seconds || 0) / 60;
    if (minutes >= 5) score += 3;
    else if (minutes >= 2) score += 2;
    else if (minutes >= 1) score += 1;

    // Paste ratio (fewer pastes is better)
    const pasteRatio = (metrics.paste_character_count || 0) / Math.max(metrics.total_keystrokes || 1, 1);
    if (pasteRatio < 0.1) score += 3;
    else if (pasteRatio < 0.3) score += 2;
    else if (pasteRatio < 0.5) score += 1;

    // Backspace ratio (some editing is good, shows revision)
    const backspaceRatio = (metrics.backspace_count || 0) / Math.max(metrics.total_keystrokes || 1, 1);
    if (backspaceRatio > 0.05 && backspaceRatio < 0.3) score += 2; // Healthy editing
    else if (backspaceRatio > 0.01) score += 1;

    // WPM (typical human typing is 30-50 WPM for composition)
    const wpm = metrics.avg_words_per_minute || 0;
    if (wpm >= 20 && wpm <= 60) score += 2;
    else if (wpm > 0 && wpm < 100) score += 1;

    // Scoring thresholds
    if (score >= 8) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
}

// Format time for display
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
}
