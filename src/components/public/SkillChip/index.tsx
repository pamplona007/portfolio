import { Code, Server, Cloud, Wrench } from 'lucide-react';
import styles from './styles.module.css';

const icons = {
  frontend: Code,
  backend: Server,
  devops: Cloud,
  tools: Wrench,
} as const;

interface SkillChipProps {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools';
}

export function SkillChip({ name, category }: SkillChipProps) {
  const Icon = icons[category];
  return (
    <span className={`${styles.chip} ${styles[category]}`}>
      <Icon size={13} />
      {name}
    </span>
  );
}
