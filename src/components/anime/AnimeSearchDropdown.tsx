'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnimeSearchResult, SelectedAnime, JikanAnimeResult } from '@/types';
import styles from './AnimeSearchDropdown.module.css';

interface AnimeSearchDropdownProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSelect: (anime: SelectedAnime) => void;
  placeholder?: string;
  inputId?: string;
}

export function AnimeSearchDropdown({
  inputValue,
  onInputChange,
  onSelect,
  placeholder = 'Search anime...',
  inputId = 'anime-search',
}: AnimeSearchDropdownProps) {
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [throttled, setThrottled] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced Jikan search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (inputValue.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(inputValue)}&limit=8&sfw=true`
        );
        if (res.status === 429) {
          setThrottled(true);
          setTimeout(() => setThrottled(false), 3000);
          return;
        }
        const data = await res.json();
        const mapped: AnimeSearchResult[] = (data.data ?? []).map(
          (item: JikanAnimeResult) => ({
            mal_id: item.mal_id,
            title: item.title_english || item.title,
            title_japanese: item.title_japanese,
            year: item.year ?? item.aired?.prop?.from?.year ?? null,
            type: item.type,
            image: item.images.jpg.small_image_url,
          })
        );
        setResults(mapped);
        setShowDropdown(mapped.length > 0);
      } catch {
        // silent fail
      } finally {
        setIsSearching(false);
      }
    }, 500);
  }, [inputValue]);

  // Click-outside close
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSelect(result: AnimeSearchResult) {
    onSelect({
      mal_id: result.mal_id,
      title: result.title,
      title_japanese: result.title_japanese,
      type: result.type,
      year: result.year,
      image: result.image,
    });
    setShowDropdown(false);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inputRow}>
        <input
          id={inputId}
          className={styles.input}
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => results.length > 0 && setShowDropdown(true)}
        />
        {isSearching && <span className={styles.spinner} aria-hidden />}
      </div>

      {throttled && (
        <p className={styles.throttleMsg}>Jikan is rate-limiting — wait a sec...</p>
      )}

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            role="listbox"
          >
            {results.map((result) => (
              <button
                key={result.mal_id}
                className={styles.resultItem}
                onClick={() => handleSelect(result)}
                type="button"
                role="option"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.image}
                  alt={result.title}
                  width={40}
                  height={56}
                  className={styles.thumb}
                />
                <div className={styles.resultInfo}>
                  <span className={styles.resultTitle}>{result.title}</span>
                  {result.title_japanese && result.title_japanese !== result.title && (
                    <span className={styles.resultJp}>{result.title_japanese}</span>
                  )}
                  <span className={styles.resultMeta}>
                    {result.year ?? '?'} · {result.type}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
