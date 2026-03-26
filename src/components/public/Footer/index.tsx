import { Github, Linkedin, Mail } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { getLocalized } from '@/types';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

export function Footer() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { profile } = useProfile();
  const year = new Date().getFullYear();

  const name = profile ? getLocalized(profile.name, lang) : 'Lucas Pamplona';
  const github = profile?.socialGithub ?? 'https://github.com/pamplona007';
  const linkedin = profile?.socialLinkedin ?? 'https://linkedin.com/in/lucaspamplona';
  const email = profile?.socialEmail ?? 'pamplona.developer@gmail.com';

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {year} {name}
        </p>
        <div className={styles.social}>
          <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.link}><Github size={18} /></a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.link}><Linkedin size={18} /></a>
          <a href={`mailto:${email}`} aria-label="Email" className={styles.link}><Mail size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
