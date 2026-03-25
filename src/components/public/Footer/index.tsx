import { Github, Linkedin, Mail } from 'lucide-react';
import styles from './styles.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {year} Lucas Pamplona
        </p>
        <div className={styles.social}>
          <a href="https://github.com/lucaspamplona" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.link}><Github size={18} /></a>
          <a href="https://linkedin.com/in/lucaspamplona" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.link}><Linkedin size={18} /></a>
          <a href="mailto:lucas@pamplona.dev" aria-label="Email" className={styles.link}><Mail size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
