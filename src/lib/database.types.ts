export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    display_name: string | null
                    role: 'reader' | 'contributor' | 'editor'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    display_name?: string | null
                    role?: 'reader' | 'contributor' | 'editor'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    display_name?: string | null
                    role?: 'reader' | 'contributor' | 'editor'
                    created_at?: string
                    updated_at?: string
                }
            }
            stories: {
                Row: {
                    id: string
                    author_id: string
                    title: string
                    summary: string
                    category: 'good' | 'bad' | 'ugly'
                    status: 'draft' | 'pending' | 'cooling' | 'live' | 'rejected'
                    thumbnail_url: string | null
                    created_at: string
                    updated_at: string
                    published_at: string | null
                    publish_at: string | null
                    admin_notes: string | null
                    views: number
                }
                Insert: {
                    id?: string
                    author_id: string
                    title: string
                    summary: string
                    category: 'good' | 'bad' | 'ugly'
                    status?: 'draft' | 'pending' | 'cooling' | 'live' | 'rejected'
                    thumbnail_url?: string | null
                    created_at?: string
                    updated_at?: string
                    published_at?: string | null
                    publish_at?: string | null
                    admin_notes?: string | null
                    views?: number
                }
                Update: {
                    id?: string
                    author_id?: string
                    title?: string
                    summary?: string
                    category?: 'good' | 'bad' | 'ugly'
                    status?: 'draft' | 'pending' | 'cooling' | 'live' | 'rejected'
                    thumbnail_url?: string | null
                    created_at?: string
                    updated_at?: string
                    published_at?: string | null
                    publish_at?: string | null
                    admin_notes?: string | null
                    views?: number
                }
            }
            chapters: {
                Row: {
                    id: string
                    story_id: string
                    title: string
                    summary: string
                    content: string
                    chapter_date: string
                    order_index: number
                    writing_metadata: WritingMetadata
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    story_id: string
                    title: string
                    summary: string
                    content: string
                    chapter_date: string
                    order_index?: number
                    writing_metadata?: WritingMetadata
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    story_id?: string
                    title?: string
                    summary?: string
                    content?: string
                    chapter_date?: string
                    order_index?: number
                    writing_metadata?: WritingMetadata
                    created_at?: string
                    updated_at?: string
                }
            }
            disputes: {
                Row: {
                    id: string
                    story_id: string
                    reporter_id: string
                    reason: string
                    status: 'open' | 'reviewing' | 'resolved' | 'dismissed'
                    admin_response: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    story_id: string
                    reporter_id: string
                    reason: string
                    status?: 'open' | 'reviewing' | 'resolved' | 'dismissed'
                    admin_response?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    story_id?: string
                    reporter_id?: string
                    reason?: string
                    status?: 'open' | 'reviewing' | 'resolved' | 'dismissed'
                    admin_response?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

// Anti-AI Writing Metrics
export interface WritingMetadata {
    time_spent_seconds?: number
    session_breaks?: number
    paste_attempts?: number
    paste_character_count?: number
    total_keystrokes?: number
    backspace_count?: number
    avg_words_per_minute?: number
    revision_count?: number
    started_at?: string
    completed_at?: string
}

// Helper types for frontend use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Story = Database['public']['Tables']['stories']['Row']
export type Chapter = Database['public']['Tables']['chapters']['Row']
export type Dispute = Database['public']['Tables']['disputes']['Row']

export type StoryStatus = Story['status']
export type DisputeStatus = Dispute['status']

export type StoryWithChapters = Story & {
    chapters: Chapter[]
    author?: Profile
}
