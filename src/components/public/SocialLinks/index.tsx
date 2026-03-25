import { Github, Linkedin, Mail } from 'lucide-react';
import styles from './styles.module.css';

interface SocialLinksProps {
  github?: string | null;
  linkedin?: string | null;
  email?: string | null;
  size?: number;
}

export function SocialLinks({ github, linkedin, email, size = 20 }: SocialLinksProps) {
  return (
    <div className={styles.links}>
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.link}>
          <Github size={size} />
        </a>
      )}
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.link}>
          <Linkedin size={size} />
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} aria-label="Email" className={styles.link}>
          <Mail size={size} />
        </a>
      )}
    </div>
  );
}
