import { useEffect, useRef } from 'react';
import { Briefcase, GraduationCap, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SkillChip } from '@/components/public/SkillChip';
import { useAboutData } from '@/hooks/useAboutData';
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

export default function About() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { profile, experiences, education, skills } = useAboutData();
  const headerRef = useScrollReveal();
  const skillsRef = useScrollReveal();
  const expRef = useScrollReveal();

  useEffect(() => {
    trackPageView('/about');
  }, []);

  const bio = getLocalized(profile?.bio, lang) ?? 'Senior Full-Stack Developer with 8+ years of experience building web applications and REST APIs.';

  const formatPeriod = (startDate: string, endDate: string | null, current: boolean, lang: string) => {
    const start = new Date(startDate).getFullYear();
    const presentLabel = lang === 'pt' ? 'Atual' : 'Present';
    const end = current ? presentLabel : endDate ? new Date(endDate).getFullYear() : '';
    return `${start} — ${end}`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <h1 className={styles.heading}>
            About <span className="gradient-text">Me</span>
          </h1>
          <div className={styles.bioGrid}>
            <p className={styles.bio}>{bio}</p>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <section ref={skillsRef} className={`${styles.section} reveal`}>
            <h2 className={styles.sectionTitle}>
              <Code size={18} />
              Skills
            </h2>
            <div className={styles.skillsGrid}>
              {skills.map((skill) => (
                <SkillChip key={skill.id} name={getLocalized(skill.name, lang)} category={skill.category} />
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section ref={expRef} className={`${styles.section} reveal`}>
            <h2 className={styles.sectionTitle}>
              <Briefcase size={18} />
              Experience
            </h2>
            <div className={styles.timeline}>
              {experiences.map((exp) => (
                <div key={exp.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineCard}>
                    <div className={styles.timelineHeader}>
                      <div>
                        <h3 className={styles.role}>{getLocalized(exp.role, lang)}</h3>
                        <p className={styles.company}>{getLocalized(exp.company, lang)}</p>
                      </div>
                      <span className={styles.period}>
                        {formatPeriod(exp.startDate, exp.endDate, exp.current, lang)}
                      </span>
                    </div>
                    {exp.description && <p className={styles.description}>{getLocalized(exp.description, lang)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className={`${styles.section} reveal`}>
            <h2 className={styles.sectionTitle}>
              <GraduationCap size={18} />
              Education
            </h2>
            <div className={styles.timeline}>
              {education.map((edu) => (
                <div key={edu.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineCard}>
                    <div className={styles.timelineHeader}>
                      <div>
                        <h3 className={styles.role}>{getLocalized(edu.degree, lang)}</h3>
                        <p className={styles.company}>{getLocalized(edu.school, lang)}</p>
                      </div>
                      <span className={styles.period}>
                        {formatPeriod(edu.startDate, edu.endDate, false, lang)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
