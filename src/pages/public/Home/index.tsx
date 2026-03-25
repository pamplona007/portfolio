import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/public/Button';
import { useProfile } from '@/hooks/useProfile';
import { trackPageView } from '@/services/analytics';
import { getLocalized } from '@/types';
import styles from './styles.module.css';

const defaultProfile = {
  name: 'Lucas Pamplona',
  title: 'Senior Full-Stack Developer',
  tagline: 'Building scalable systems with clean architecture',
  github: 'https://github.com/lucaspamplona',
  linkedin: 'https://linkedin.com/in/lucaspamplona',
  email: 'lucas@pamplona.dev',
};

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { profile, loading } = useProfile();
  const statsRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const socialRef = useScrollReveal();

  useEffect(() => {
    trackPageView('/');
  }, []);

  const name = getLocalized(profile?.name, lang) ?? defaultProfile.name;
  const title = getLocalized(profile?.title, lang) ?? defaultProfile.title;
  const tagline = getLocalized(profile?.tagline, lang) ?? defaultProfile.tagline;
  const github = profile?.socialGithub ?? defaultProfile.github;
  const linkedin = profile?.socialLinkedin ?? defaultProfile.linkedin;
  const email = profile?.socialEmail ?? defaultProfile.email;

  const stats = [
    { number: '8+', label: 'Years Experience' },
    { number: '50+', label: 'Projects Delivered' },
    { number: '4+', label: 'Years at Weavel' },
  ];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={`${styles.eyebrow} reveal`} style={{ animationDelay: '0ms' }}>
            {loading ? '' : title}
          </span>
          <h1 className={`${styles.name} reveal`} style={{ animationDelay: '100ms' }}>
            <span className="gradient-text">{name}</span>
          </h1>
          <p className={`${styles.title} reveal`} style={{ animationDelay: '200ms' }}>
            {title}
          </p>
          <p className={`${styles.tagline} reveal`} style={{ animationDelay: '300ms' }}>
            {tagline}
          </p>

          <div ref={ctaRef} className={`${styles.ctas} reveal`} style={{ animationDelay: '400ms' }}>
            <Link to="/projects">
              <Button variant="primary" size="lg">
                View Projects <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>

          <div ref={socialRef} className={`${styles.social} reveal`} style={{ animationDelay: '500ms' }}>
            <a href={github} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href={`mailto:${email}`} className={styles.socialLink} aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div ref={statsRef} className={`${styles.statsGrid} reveal`}>
          {stats.map((stat, i) => (
            <div key={stat.label} className={styles.statItem} style={{ animationDelay: `${i * 100}ms` }}>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
