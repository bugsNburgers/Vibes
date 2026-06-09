import styles from './LoadingSkeleton.module.css';

interface LoadingSkeletonProps {
  variant: 'card' | 'track' | 'pet-card' | 'text-line';
  count?: number;
}

export function LoadingSkeleton({ variant, count = 1 }: LoadingSkeletonProps) {
  const variantClass = {
    'card': styles.card,
    'track': styles.track,
    'pet-card': styles.petCard,
    'text-line': styles.textLine,
  }[variant];

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${styles.skeleton} ${variantClass}`} aria-hidden />
      ))}
    </>
  );
}
