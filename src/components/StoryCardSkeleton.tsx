const StoryCardSkeleton = () => {
    return (
        <div className="border-b border-border py-6 animate-pulse">
            {/* Image placeholder */}
            <div className="w-full aspect-video bg-gray-200 mb-4" />

            {/* Title placeholder */}
            <div className="h-6 bg-gray-200 mb-3 w-3/4" />

            {/* Summary placeholder - 2 lines */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 w-full" />
                <div className="h-4 bg-gray-200 w-5/6" />
            </div>

            {/* Meta placeholder */}
            <div className="flex items-center gap-4">
                <div className="h-3 bg-gray-200 w-20" />
                <div className="h-3 bg-gray-200 w-16" />
            </div>
        </div>
    );
};

export default StoryCardSkeleton;
