import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserStories } from '@/services/stories';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import CategoryLabel from '@/components/CategoryLabel';
import StoryCardSkeleton from '@/components/StoryCardSkeleton';
import EmptyState from '@/components/EmptyState';

export default function MyStories() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: stories, isLoading, error } = useQuery({
        queryKey: ['my-stories', user?.id],
        queryFn: () => fetchUserStories(user!.id),
        enabled: !!user,
    });

    // Auth guard
    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <AppHeader onWriteClick={() => navigate('/write')} />
                <main className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center">
                        <h2 className="font-display text-3xl font-bold mb-4">Sign In Required</h2>
                        <p className="font-body text-muted-foreground">
                            You need to be signed in to view your stories.
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AppHeader onWriteClick={() => navigate('/write')} />

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                <div className="flex items-center justify-between mb-10">
                    <h1
                        className="text-4xl md:text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Pirata One', cursive" }}
                    >
                        My Stories
                    </h1>
                    <button
                        onClick={() => navigate('/write')}
                        className="font-ui text-sm px-5 py-2.5 bg-foreground text-background hover:opacity-90 transition-opacity"
                        style={{ border: '2px solid black' }}
                    >
                        + Write
                    </button>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="grid gap-6">
                        {[1, 2, 3].map((i) => (
                            <StoryCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div
                        className="p-6 text-center font-body text-muted-foreground"
                        style={{ border: '2px solid black' }}
                    >
                        <p className="font-display text-xl font-bold mb-2">Something went wrong</p>
                        <p>Could not load your stories. Please try again.</p>
                    </div>
                )}

                {/* Empty */}
                {!isLoading && !error && stories && stories.length === 0 && (
                    <EmptyState
                        title="No stories yet"
                        description="The Registry is waiting for your truth. Write your first story."
                        actionLabel="Write a Story"
                        onAction={() => navigate('/write')}
                    />
                )}

                {/* Story list */}
                {!isLoading && stories && stories.length > 0 && (
                    <div className="grid gap-4">
                        {stories.map((story) => (
                            <article
                                key={story.id}
                                className="p-5 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                                style={{ border: '2px solid black' }}
                                onClick={() => navigate(`/story/${story.id}`)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                                    {/* Main content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-display text-lg font-bold text-foreground truncate">
                                            {story.title}
                                        </h3>
                                        <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {story.summary}
                                        </p>
                                        <p className="font-mono text-xs text-muted-foreground mt-2">
                                            {new Date(story.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap items-start gap-2 sm:flex-col sm:items-end">
                                        <CategoryLabel category={story.category} size="sm" />
                                        <StatusBadge
                                            status={story.status}
                                            publishAt={story.publish_at}
                                            adminNotes={story.admin_notes}
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
