'use client';

import { useState, useRef } from 'react';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { FormField } from '@/components/ui/FormField';
import { uploadPet } from '@/lib/api';
import styles from './PetUploadForm.module.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return 'Only JPG, PNG, or WebP.';
  if (file.size > MAX_SIZE) return 'Max file size is 5MB.';
  return null;
}

const ANIMAL_TYPES = [
  'cat', 'dog', 'bird', 'rabbit', 'hamster',
  'fish', 'reptile', 'other',
];

export function PetUploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [petName, setPetName] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error' | 'rate-limited'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { setFileError(err); return; }
    setFileError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { setFileError(err); return; }
    setFileError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function clearFile() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setFileError('Please select a photo.'); return; }
    if (!animalType) return;
    if (!uploaderName.trim()) return;

    setIsUploading(true);
    setSubmitStatus('idle');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('pet_name', petName);
    fd.append('animal_type', animalType);
    fd.append('uploader_name', uploaderName);

    const result = await uploadPet(fd);

    if (result.success) {
      setSubmitStatus('success');
      setUploadedUrl(result.imageUrl ?? null);
      clearFile();
      setPetName('');
      setAnimalType('');
      setUploaderName('');
    } else if (result.message.toLowerCase().includes('limit')) {
      setSubmitStatus('rate-limited');
    } else {
      setSubmitStatus('error');
      setErrorMessage(result.message);
    }
    setIsUploading(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Drop zone */}
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${fileError ? styles.dropError : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !preview && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        aria-label="Upload pet photo"
      >
        {preview ? (
          <div className={styles.previewWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className={styles.previewImg} />
            <button
              type="button"
              className={styles.clearFile}
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
            >
              ✕ remove
            </button>
          </div>
        ) : (
          <div className={styles.dropContent}>
            <span className={styles.uploadIcon}>📸</span>
            <p className={styles.dropText}>
              drop a photo here or <span className={styles.browse}>browse</span>
            </p>
            <p className={styles.dropHint}>jpg, png, or webp · max 5mb</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          hidden
          onChange={handleFileChange}
        />
      </div>
      {fileError && <p className={styles.fieldError}>{fileError}</p>}

      {/* Animal type selector */}
      <div className={styles.fieldWrapper}>
        <label className={styles.label} htmlFor="animal-type">
          Animal type <span className={styles.required}>*</span>
        </label>
        <div className={styles.typeGrid}>
          {ANIMAL_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={`${styles.typeBtn} ${animalType === t ? styles.typeBtnActive : ''}`}
              onClick={() => setAnimalType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <FormField
        label="Pet's name"
        name="pet-name"
        type="text"
        placeholder="optional — strays count"
        value={petName}
        onChange={setPetName}
      />

      <FormField
        label="Your name or handle *"
        name="uploader-name"
        type="text"
        required
        placeholder="who should we credit?"
        value={uploaderName}
        onChange={setUploaderName}
      />

      <BrutalButton
        type="submit"
        variant="accent"
        loading={isUploading}
        disabled={!file || !animalType || !uploaderName.trim()}
      >
        upload pet
      </BrutalButton>

      {submitStatus === 'success' && (
        <div className={styles.successMsg}>
          <p>Added to the gallery! 🐾</p>
          {uploadedUrl && (
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
              view photo ↗
            </a>
          )}
        </div>
      )}
      {submitStatus === 'rate-limited' && (
        <p className={styles.rateLimited}>
          Upload limit reached for today. Come back tomorrow!
        </p>
      )}
      {submitStatus === 'error' && (
        <p className={styles.error}>{errorMessage}</p>
      )}
    </form>
  );
}
