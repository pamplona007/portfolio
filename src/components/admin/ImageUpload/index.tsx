import { useState, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/services/supabase';
import styles from './styles.module.css';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  path?: string;
}

export function ImageUpload({ value, onChange, bucket = 'screenshots', path }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const filePath = path ?? `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      onChange(data.publicUrl);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={styles.wrapper}>
      {value ? (
        <div className={styles.preview}>
          <img src={value} alt="Upload preview" className={styles.previewImg} />
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onChange('')}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${uploading ? styles.uploading : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className={styles.input}
          />
          {uploading ? (
            <div className={styles.uploadingText}>Uploading...</div>
          ) : (
            <>
              <div className={styles.uploadIcon}>
                {error ? <X size={24} /> : <ImageIcon size={24} />}
              </div>
              <div className={styles.uploadText}>
                {error ?? 'Click or drag to upload'}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
