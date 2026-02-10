import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Story, Chapter, StoryWithChapters, WritingMetadata } from '@/lib/database.types';

// Type guard for chapter sorting
interface ChapterWithOrder {
    order_index: number;
    [key: string]: unknown;
}

// Fetch all live stories with chapters
export async function fetchPublishedStories(category?: 'good' | 'bad' | 'ugly'): Promise<StoryWithChapters[]> {
    if (!isSupabaseConfigured()) {
        return [];
    }

    let query = supabase
        .from('stories')
        .select(`
      *,
      chapters(*),
      author:profiles(id, display_name, email)
    `)
        .eq('status', 'live')
        .order('published_at', { ascending: false });

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching stories:', error);
        return [];
    }

    // Sort chapters by order_index
    return (data || []).map(story => ({
        ...story,
        chapters: ((story as { chapters?: ChapterWithOrder[] }).chapters || []).sort((a, b) => a.order_index - b.order_index)
    })) as StoryWithChapters[];
}

// Fetch stories pending review (for moderators)
export async function fetchPendingStories(): Promise<StoryWithChapters[]> {
    if (!isSupabaseConfigured()) {
        return [];
    }

    const { data, error } = await supabase
        .from('stories')
        .select(`
      *,
      chapters(*),
      author:profiles(id, display_name, email)
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching pending stories:', error);
        return [];
    }

    return (data || []).map(story => ({
        ...story,
        chapters: ((story as { chapters?: ChapterWithOrder[] }).chapters || []).sort((a, b) => a.order_index - b.order_index)
    })) as StoryWithChapters[];
}

// Fetch user's own stories (any status)
export async function fetchUserStories(userId: string): Promise<StoryWithChapters[]> {
    if (!isSupabaseConfigured()) {
        return [];
    }

    const { data, error } = await supabase
        .from('stories')
        .select(`
      *,
      chapters(*)
    `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user stories:', error);
        return [];
    }

    return (data || []).map(story => ({
        ...story,
        chapters: ((story as { chapters?: ChapterWithOrder[] }).chapters || []).sort((a, b) => a.order_index - b.order_index)
    })) as StoryWithChapters[];
}

// Create a new story with first chapter
export async function createStory(
    authorId: string,
    title: string,
    summary: string,
    category: 'good' | 'bad' | 'ugly',
    chapter: {
        title: string;
        summary: string;
        content: string;
        chapterDate: string;
        writingMetadata?: WritingMetadata;
    },
    thumbnailUrl?: string
): Promise<{ story: Story | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
        return { story: null, error: new Error('Backend not configured. Please check your Supabase credentials.') };
    }

    // Create story - use any to bypass strict typing when Supabase isn't configured
    const storiesTable = supabase.from('stories') as ReturnType<typeof supabase.from>;
    const { data: story, error: storyError } = await (storiesTable as any)
        .insert({
            author_id: authorId,
            title,
            summary,
            category,
            status: 'pending',
            thumbnail_url: thumbnailUrl
        })
        .select()
        .single();

    if (storyError || !story) {
        return { story: null, error: storyError as Error };
    }

    const storyData = story as { id: string };

    // Create first chapter
    const chaptersTable = supabase.from('chapters') as ReturnType<typeof supabase.from>;
    const { error: chapterError } = await (chaptersTable as any)
        .insert({
            story_id: storyData.id,
            title: chapter.title,
            summary: chapter.summary,
            content: chapter.content,
            chapter_date: chapter.chapterDate,
            order_index: 0,
            writing_metadata: chapter.writingMetadata || {}
        });

    if (chapterError) {
        // Rollback story if chapter fails
        await (storiesTable as any).delete().eq('id', storyData.id);
        return { story: null, error: chapterError as Error };
    }

    return { story: story as Story, error: null };
}

// Add chapter to existing story
export async function addChapter(
    storyId: string,
    chapter: {
        title: string;
        summary: string;
        content: string;
        chapterDate: string;
        writingMetadata?: WritingMetadata;
    }
): Promise<{ chapter: Chapter | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
        return { chapter: null, error: new Error('Backend not configured. Please check your Supabase credentials.') };
    }

    // Get current max order_index
    const chaptersTable = supabase.from('chapters') as ReturnType<typeof supabase.from>;
    const { data: existingChapters } = await (chaptersTable as any)
        .select('order_index')
        .eq('story_id', storyId)
        .order('order_index', { ascending: false })
        .limit(1);

    const chaptersData = existingChapters as { order_index: number }[] | null;
    const nextIndex = (chaptersData?.[0]?.order_index ?? -1) + 1;

    const { data, error } = await (chaptersTable as any)
        .insert({
            story_id: storyId,
            title: chapter.title,
            summary: chapter.summary,
            content: chapter.content,
            chapter_date: chapter.chapterDate,
            order_index: nextIndex,
            writing_metadata: chapter.writingMetadata || {}
        })
        .select()
        .single();

    return { chapter: data as Chapter | null, error: error as Error | null };
}

// Update story status (for moderators)
export async function updateStoryStatus(
    storyId: string,
    status: 'draft' | 'pending' | 'cooling' | 'live' | 'rejected'
): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured()) {
        return { error: new Error('Backend not configured. Please check your Supabase credentials.') };
    }

    const updates: Record<string, unknown> = { status };

    if (status === 'live') {
        updates.published_at = new Date().toISOString();
    }

    const storiesTable = supabase.from('stories') as ReturnType<typeof supabase.from>;
    const { error } = await (storiesTable as any)
        .update(updates)
        .eq('id', storyId);

    return { error: error as Error | null };
}

// Delete story (reject)
export async function deleteStory(storyId: string): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured()) {
        return { error: new Error('Backend not configured. Please check your Supabase credentials.') };
    }

    const storiesTable = supabase.from('stories') as ReturnType<typeof supabase.from>;
    const { error } = await (storiesTable as any)
        .delete()
        .eq('id', storyId);

    return { error: error as Error | null };
}
