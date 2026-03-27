import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/public/Button';
import { Card } from '@/components/public/Card';
import { SkillChip } from '@/components/public/SkillChip';
import { TechLogo } from '@/components/public/TechLogo';
import { useProfile } from '@/hooks/useProfile';
import { useProjects } from '@/hooks/useProjects';
import { useAboutData } from '@/hooks/useAboutData';
import { trackPageView } from '@/services/analytics';
import { getLocalized } from '@/types';
import styles from './styles.module.css';

const defaultProfile = {
  name: 'Lucas Pamplona',
  title: 'Senior Full-Stack Developer',
  tagline: 'Building scalable systems with clean architecture',
  github: 'https://github.com/pamplona007',
  linkedin: 'https://linkedin.com/in/lucaspamplona',
  email: 'pamplona.developer@gmail.com',
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { profile, loading } = useProfile();
  const { projects } = useProjects();
  const { skills } = useAboutData();

  useEffect(() => {
    trackPageView('/');
  }, []);

  const name = getLocalized(profile?.name, lang) ?? defaultProfile.name;
  const title = getLocalized(profile?.title, lang) ?? defaultProfile.title;
  const tagline = getLocalized(profile?.tagline, lang) ?? defaultProfile.tagline;
  const github = profile?.socialGithub ?? defaultProfile.github;
  const linkedin = profile?.socialLinkedin ?? defaultProfile.linkedin;
  const email = profile?.socialEmail ?? defaultProfile.email;

  // Split name into two lines for dramatic effect
  const nameParts = name.split(' ');
  const nameLine1 = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(' ');
  const nameLine2 = nameParts.slice(Math.ceil(nameParts.length / 2)).join(' ');

  const stats = [
    { number: `${profile?.yearsExperience ?? 0}+`, label: t('home.yearsExp') },
    { number: `${profile?.projectsDelivered ?? 0}+`, label: t('home.projectsDelivered') },
    { number: `${profile?.yearsAtCompany ?? 0}+`, label: t('home.yearsAtWeavel') },
  ];

  // Featured projects - show first 3
  const featuredProjects = projects.slice(0, 3);

  // Top skills - all of them for the cloud
  const topSkills = skills;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              {/* Eyebrow */}
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowDot} />
                {loading ? '\u00A0' : title}
              </div>

              {/* Name — large typographic impact */}
              <h1 className={styles.name}>
                <span>{nameLine1}</span>
                {nameLine2 && <span className={styles.nameLine2}>{nameLine2}</span>}
              </h1>

              {/* Role title */}
              <p className={styles.title}>{title}</p>

              {/* Tagline */}
              <p className={styles.tagline}>{tagline}</p>

              {/* CTAs */}
              <div className={styles.ctas}>
                <Link to="/projects">
                  <Button variant="primary" size="lg">
                    {t('home.viewProjects')} <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" size="lg">
                    {t('home.getInTouch')}
                  </Button>
                </Link>
              </div>

              {/* Social links */}
              <div className={styles.social}>
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

              {/* Scroll indicator */}
              <div className={styles.scrollIndicator}>
                <span className={styles.scrollText}>scroll</span>
                <div className={styles.scrollLine} />
              </div>
            </div>

            {topSkills.length > 0 && (
              <div className={styles.skillsCloud} aria-hidden="true">
                {[...topSkills, ...topSkills].map((skill, i) => (
                  <div
                    key={`${skill.id}-${i}`}
                    className={styles.cloudChip}
                    style={{ animationDelay: `${(i % topSkills.length) * 0.4}s` }}
                  >
                    <SkillChip name={getLocalized(skill.name, lang)} category={skill.category} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <div className={styles.featuredHeader}>
              <div>
                <span className={styles.featuredLabel}>Portfolio</span>
                <h2 className={styles.featuredTitle}>Featured Work</h2>
              </div>
              <Link to="/projects">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            <div className={styles.featuredGrid}>
              {featuredProjects.map((project) => (
                <Card key={project.id} className={styles.featuredCard}>
                  <div className={styles.featuredCardInner}>
                    <div className={styles.featuredCardTop}>
                      <h3 className={styles.featuredCardTitle}>
                        {getLocalized(project.title, lang)}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {project.repoUrl && (
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-secondary)', display: 'flex', transition: 'color 0.2s' }}>
                            <Github size={15} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-secondary)', display: 'flex', transition: 'color 0.2s' }}>
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className={styles.featuredCardDesc}>
                      {getLocalized(project.description, lang)}
                    </p>
                    {project.techStack && project.techStack.length > 0 && (
                      <div className={styles.featuredCardTech}>
                        {project.techStack.slice(0, 3).map((tag) => (
                          <span key={tag} style={{
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--color-text-muted)',
                            background: 'var(--color-glass-bg)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            padding: '2px 8px',
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link to="/projects" className={styles.featuredCardCta}>
                      Learn more <ArrowRight size={14} />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tech Marquee */}
      {skills.length > 0 && (
        <section className={styles.marqueeSection}>
          <div className={styles.marqueeOuter}>
            <div className={styles.marqueeInner}>
              {[...skills, ...skills].map((skill, i) => (
                <div key={`${skill.id}-${i}`} className={styles.marqueeItem}>
                  <TechLogo name={skill.name.en} category={skill.category} />
                  <span className={styles.marqueeName}>{skill.name.en}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
