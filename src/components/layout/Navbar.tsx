'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      className={styles.nav}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container">
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            vibes<span className={styles.dot}>.</span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Main navigation">
            <NavLink href="/anime">anime</NavLink>
            <NavLink href="/music">music</NavLink>
            <NavLink href="/pets">pets</NavLink>
          </nav>

          <a
            href="https://suprateekyawagal.in"
            className={styles.portfolioLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            ← the serious version
          </a>

          <button
            className={styles.hamburger}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span className={`${styles.bar} ${isOpen ? styles.barTopOpen : ''}`} />
            <span className={`${styles.bar} ${isOpen ? styles.barMidOpen : ''}`} />
            <span className={`${styles.bar} ${isOpen ? styles.barBotOpen : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <NavLink href="/anime" onClick={() => setIsOpen(false)}>anime</NavLink>
            <NavLink href="/music" onClick={() => setIsOpen(false)}>music</NavLink>
            <NavLink href="/pets" onClick={() => setIsOpen(false)}>pets</NavLink>
            <a
              href="https://suprateekyawagal.in"
              className={styles.mobilePortfolio}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              ← the serious version
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
