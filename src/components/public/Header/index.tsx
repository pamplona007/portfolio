import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import styles from './styles.module.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const toggleLang = () => {
    i18n.changeLanguage(currentLang === 'en' ? 'pt' : 'en');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className="gradient-text">LP</span>
        </Link>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`${styles.navLink} ${location.pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.social}>
          <button onClick={toggleLang} className={styles.langToggle} aria-label="Toggle language">
            {currentLang === 'en' ? '🇧🇷 PT' : '🇬🇧 EN'}
          </button>
          <a href="https://github.com/lucaspamplona" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.socialLink}>
            <Github size={18} />
          </a>
          <a href="https://linkedin.com/in/lucaspamplona" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialLink}>
            <Linkedin size={18} />
          </a>
          <a href="mailto:lucas@pamplona.dev" aria-label="Email" className={styles.socialLink}>
            <Mail size={18} />
          </a>
        </div>

        <button
          className={styles.menuButton}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`${styles.mobileNavLink} ${location.pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileSocial}>
            <a href="https://github.com/lucaspamplona" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><Github size={20} /></a>
            <a href="https://linkedin.com/in/lucaspamplona" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><Linkedin size={20} /></a>
            <a href="mailto:lucas@pamplona.dev" className={styles.socialLink}><Mail size={20} /></a>
          </div>
        </div>
      )}
    </header>
  );
}
