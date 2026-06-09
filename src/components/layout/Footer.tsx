import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <span>built with questionable taste by suprateeky</span>
          <span className={styles.dot}>·</span>
          <a
            href="https://suprateekyawagal.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            the serious version →
          </a>
          <span className={styles.dot}>·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
