import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ThumbnailUploadProps {
    value?: string;
    onChange: (url: string | undefined) => void;
}

const ThumbnailUpload = ({ value, onChange }: ThumbnailUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        if (!isSupabaseConfigured()) {
            setError('Supabase not configured. Using preview only.');
            // Create local preview URL
            const localUrl = URL.createObjectURL(file);
            onChange(localUrl);
            return;
        }

        // Validate file
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be less than 2MB');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `thumbnails/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('thumbnails')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                // If bucket doesn't exist yet, use local preview
                if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
                    setError('Storage not configured. Using preview.');
                    const localUrl = URL.createObjectURL(file);
                    onChange(localUrl);
                } else {
                    throw uploadError;
                }
            } else {
                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('thumbnails')
                    .getPublicUrl(filePath);

                onChange(publicUrl);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Upload failed. Try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleRemove = () => {
        onChange(undefined);
        setError(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="mb-6">
            <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Thumbnail Image
            </label>

            {value ? (
                <div className="relative w-full h-40 border border-border overflow-hidden group">
                    <img
                        src={value}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`
            w-full h-32 border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-2
            transition-colors
            ${dragActive
                            ? 'border-foreground bg-secondary'
                            : 'border-border hover:border-foreground/50'
                        }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
                >
                    {uploading ? (
                        <>
                            <Loader2 size={24} className="text-muted-foreground animate-spin" />
                            <span className="font-ui text-xs text-muted-foreground">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ImageIcon size={20} />
                                <Upload size={16} />
                            </div>
                            <span className="font-ui text-xs text-muted-foreground">
                                Click or drag image here
                            </span>
                            <span className="font-ui text-[10px] text-muted-foreground/60">
                                Max 2MB • JPG, PNG, WebP
                            </span>
                        </>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {error && (
                <p className="font-ui text-xs text-orange-500 mt-2">{error}</p>
            )}
        </div>
    );
};

export default ThumbnailUpload;
