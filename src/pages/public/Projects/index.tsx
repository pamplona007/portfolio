import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/public/Card';
import { Badge } from '@/components/public/Badge';
import { Button } from '@/components/public/Button';
import { useProjects } from '@/hooks/useProjects';
import { trackPageView } from '@/services/analytics';
import { getLocalized } from '@/types';
import styles from './styles.module.css';

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

export default function Projects() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const { projects, loading } = useProjects('active');
  const [filter, setFilter] = useState<string | null>(null);
  const headerRef = useScrollReveal();
  const filtersRef = useScrollReveal();
  const gridRef = useScrollReveal();

  useEffect(() => {
    trackPageView('/projects');
  }, []);

  const allTechs = Array.from(new Set(projects.flatMap((p) => p.techStack))).sort();

  const filtered = filter
    ? projects.filter((p) => p.techStack.includes(filter))
    : projects;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <h1 className={styles.heading}>
            {t('projects.title')}
          </h1>
          <p className={styles.subheading}>
            {t('projects.subtitle')}
          </p>
        </div>

        <div ref={filtersRef} className={`${styles.filters} reveal`}>
          <Button variant={filter === null ? 'primary' : 'ghost'} size="sm" onClick={() => setFilter(null)}>
            {t('projects.all')}
          </Button>
          {allTechs.map((tech) => (
            <Button key={tech} variant={filter === tech ? 'primary' : 'ghost'} size="sm" onClick={() => setFilter(tech)}>
              {tech}
            </Button>
          ))}
        </div>

        <div ref={gridRef} className={`${styles.grid} reveal`}>
          {filtered.map((project, i) => (
            <Card key={project.id} className={styles.projectCard}>
              <div className={styles.cardInner} style={{ animationDelay: `${i * 80}ms` }}>
                <div className={styles.cardTop}>
                  <h3 className={styles.projectTitle}>{getLocalized(project.title, lang)}</h3>
                  <div className={styles.links}>
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label="Repository" className={styles.linkIcon}>
                        <Github size={17} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live site" className={styles.linkIcon}>
                        <ExternalLink size={17} />
                      </a>
                    )}
                  </div>
                </div>
                <p className={styles.description}>{getLocalized(project.description, lang)}</p>
                <div className={styles.techStack}>
                  {project.techStack.map((tech) => <Badge key={tech}>{tech}</Badge>)}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className={styles.empty}>
            <p>{t('projects.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
