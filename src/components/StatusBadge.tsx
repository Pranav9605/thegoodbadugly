import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { StoryStatus } from '@/lib/database.types';

interface StatusBadgeProps {
    status: StoryStatus;
    publishAt?: string | null;
    adminNotes?: string | null;
}

const STATUS_CONFIG: Record<StoryStatus, {
    label: string;
    borderStyle: string;
    textColor: string;
}> = {
    draft: {
        label: 'DRAFT',
        borderStyle: '2px dashed #9ca3af',
        textColor: 'text-gray-500',
    },
    pending: {
        label: 'PENDING',
        borderStyle: '2px solid #9ca3af',
        textColor: 'text-gray-600',
    },
    cooling: {
        label: 'COOLING',
        borderStyle: '2px solid #3b82f6',
        textColor: 'text-blue-600',
    },
    live: {
        label: 'LIVE',
        borderStyle: '2px solid #000000',
        textColor: 'text-black',
    },
    rejected: {
        label: 'REJECTED',
        borderStyle: '2px solid #ef4444',
        textColor: 'text-red-600',
    },
};

function getCoolingCountdown(publishAt: string | null | undefined): string | null {
    if (!publishAt) return null;
    const target = new Date(publishAt).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) return 'Ready';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

export default function StatusBadge({ status, publishAt, adminNotes }: StatusBadgeProps) {
    const [showNotes, setShowNotes] = useState(false);
    const config = STATUS_CONFIG[status];
    const countdown = status === 'cooling' ? getCoolingCountdown(publishAt) : null;

    return (
        <div className="inline-flex flex-col">
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 font-ui text-xs uppercase tracking-widest ${config.textColor}`}
                style={{ border: config.borderStyle }}
            >
                {config.label}
                {countdown && (
                    <span className="font-mono text-[10px] opacity-75">
                        {countdown}
                    </span>
                )}
            </span>

            {status === 'rejected' && adminNotes && (
                <div className="mt-1">
                    <button
                        onClick={() => setShowNotes(!showNotes)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors font-ui"
                    >
                        {showNotes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {showNotes ? 'Hide reason' : 'Show reason'}
                    </button>
                    {showNotes && (
                        <p className="mt-1 text-xs text-red-600 font-body leading-relaxed max-w-xs"
                            style={{ border: '1px solid #fca5a5', padding: '6px 8px' }}>
                            {adminNotes}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
