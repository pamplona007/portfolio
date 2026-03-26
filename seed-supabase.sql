-- Portfolio Seed SQL
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/avyxouzghqddtazbslpj/sql

-- ============================================
-- PROFILE
-- ============================================
update profile set
  name = jsonb_build_object('en', 'Lucas Pamplona', 'pt', 'Lucas Pamplona'),
  title = jsonb_build_object('en', 'Senior Full Stack Developer', 'pt', 'Desenvolvedor Full Stack Sênior'),
  tagline = jsonb_build_object('en', 'Building digital experiences that matter', 'pt', 'Construindo experiências digitais que importam'),
  bio = jsonb_build_object('en', 
    'Senior full stack developer with 6 years of experience delivering web solutions and leading teams. Specialist in ReactJS, TypeScript, and Node.js.' || E'\n\n' ||
    'I "current"ly work as a full stack web developer at Else Consultoria, where I lead the development of ReactJS and TypeScript applications, including a browser extension with over 6,000 daily users.' || E'\n\n' ||
    'I''m also a teacher at Youth Space, teaching JavaScript, Python, and the first in-person React Native course in the state of Ceará.' || E'\n\n' ||
    'When I''m not coding: video games, motorcycles, karting, and guitar.',
    'pt',
    'Desenvolvedor full stack sênior com 6 anos de experiência entregando soluções web e liderando times. Especialista em ReactJS, TypeScript e Node.js.' || E'\n\n' ||
    'Atualmente trabalho como desenvolvedor web full stack na Else Consultoria, onde lidero o desenvolvimento de aplicações ReactJS e TypeScript, incluindo uma extensão de navegador com mais de 6.000 usuários diários.' || E'\n\n' ||
    'Também sou professor na Youth Space, onde ensino JavaScript, Python e o primeiro curso presencial de React Native no estado do Ceará.' || E'\n\n' ||
    'Quando não estou programando: videogame, motocicleta, kart e guitarra.'
  ),
  "metaDescription" = jsonb_build_object('en', 'Senior Full Stack Developer specializing in ReactJS, TypeScript and Node.js. Based in Fortaleza, Brazil.', 'pt', 'Desenvolvedor Full Stack Sênior especializado em ReactJS, TypeScript e Node.js. Baseado em Fortaleza, Brasil.'),
  "socialGithub" = 'https://github.com/pamplona007',
  "socialLinkedin" = 'https://linkedin.com/in/lucaspamplona',
  "socialEmail" = 'pamplona.developer@gmail.com',
  theme = 'dark',
  years_experience = 8,
  projects_delivered = 50,
  years_at_company = 4
where id = '00000000-0000-0000-0000-000000000001';

-- If no profile row exists, insert one
insert into profile (id, name, title, tagline, bio, "metaDescription", "socialGithub", "socialLinkedin", "socialEmail", theme, years_experience, projects_delivered, years_at_company)
select
  '00000000-0000-0000-0000-000000000001'::uuid,
  jsonb_build_object('en', 'Lucas Pamplona', 'pt', 'Lucas Pamplona'),
  jsonb_build_object('en', 'Senior Full Stack Developer', 'pt', 'Desenvolvedor Full Stack Sênior'),
  jsonb_build_object('en', 'Building digital experiences that matter', 'pt', 'Construindo experiências digitais que importam'),
  jsonb_build_object('en', 'Senior full stack developer with 6 years of experience.', 'pt', 'Desenvolvedor full stack sênior com 6 anos de experiência.'),
  jsonb_build_object('en', 'Senior Full Stack Developer in Fortaleza, Brazil.', 'pt', 'Desenvolvedor Full Stack Sênior em Fortaleza, Brasil.'),
  'https://github.com/pamplona007',
  'https://linkedin.com/in/lucaspamplona',
  'pamplona.developer@gmail.com',
  'dark',
  8,
  50,
  4
where not exists (select 1 from profile where id = '00000000-0000-0000-0000-000000000001');

-- ============================================
-- EXPERIENCE
-- ============================================
delete from experience;

insert into experience (company, role, "startDate", "endDate", "current", description, "sortOrder") values
(
  jsonb_build_object('en', 'Else Consultoria', 'pt', 'Else Consultoria'),
  jsonb_build_object('en', 'Full Stack Web Developer', 'pt', 'Desenvolvedor Web Full Stack'),
  '2022-01', null, true,
  jsonb_build_object('en', 'Lead development of ReactJS and TypeScript applications. Developed a browser extension with over 6,000 daily users. Optimized automated tests, reducing CI/CD pipeline execution time by 60%.',
    'pt', 'Lidero o desenvolvimento e manutenção de aplicações ReactJS e TypeScript. Desenvolvi uma extensão de navegador com mais de 6.000 usuários diários. Otimizei testes automatizados, reduzindo tempo de execução de pipelines em 60%.'),
  0
),
(
  jsonb_build_object('en', 'Youth Space', 'pt', 'Youth Space'),
  jsonb_build_object('en', 'Teacher', 'pt', 'Professor'),
  '2025-03', null, true,
  jsonb_build_object('en', 'Teaching JavaScript and Python courses. First in-person React Native teacher in the state of Ceará.',
    'pt', 'Ministro aulas de JavaScript e Python. Professor do primeiro curso presencial de React Native no estado do Ceará.'),
  1
),
(
  jsonb_build_object('en', 'Digital College Brasil', 'pt', 'Digital College Brasil'),
  jsonb_build_object('en', 'Mentor', 'pt', 'Mentor'),
  '2024-03', '2025-02', false,
  jsonb_build_object('en', 'Mentored professionals and students in HTML, CSS, JavaScript, ReactJS, and Node.js. Taught over 50 students.',
    'pt', 'Mentorei profissionais e estudantes em HTML, CSS, JavaScript, ReactJS e Node.js. Já ensinei mais de 50 alunos.'),
  2
),
(
  jsonb_build_object('en', 'Ask Technology', 'pt', 'Ask Technology'),
  jsonb_build_object('en', 'Tech Leader & Full Stack Developer', 'pt', 'Tech Leader e Desenvolvedor Full Stack'),
  '2023-02', '2024-02', false,
  jsonb_build_object('en', 'Technical leadership and guidance to the development team. Developed web and mobile applications using ReactJS, React Native, and TypeScript. Managed complete project development ensuring 100% on-time delivery.',
    'pt', 'Proporcionei liderança técnica e orientação à equipe de desenvolvimento. Desenvolvi aplicações web e mobile utilizando ReactJS, React Native e TypeScript. Gerenciei o desenvolvimento completo de projetos, assegurando entrega pontual em 100% dos contratos.'),
  3
),
(
  jsonb_build_object('en', 'Darkmira Brasil', 'pt', 'Darkmira Brasil'),
  jsonb_build_object('en', 'Full Stack Web Developer', 'pt', 'Desenvolvedor Web Full Stack'),
  '2020-12', '2022-01', false,
  jsonb_build_object('en', 'Contributed to personalized digital solutions for various clients. Used ReactJS and TypeScript for UI development. Built robust and scalable applications using Symfony, PostgreSQL, and Docker.',
    'pt', 'Contribuí para o desenvolvimento de soluções digitais personalizadas para diversos clientes. Utilizei ReactJS e TypeScript para criar interfaces. Construí aplicações robustas e escaláveis utilizando Symfony, PostgreSQL e Docker.'),
  4
);

-- ============================================
-- EDUCATION
-- ============================================
delete from education;

insert into education (school, degree, field, "startDate", "endDate") values
(
  jsonb_build_object('en', 'Descomplica', 'pt', 'Descomplica'),
  jsonb_build_object('en', 'Bachelor''s Degree', 'pt', 'Bacharelado'),
  jsonb_build_object('en', 'Computer Science', 'pt', 'Ciência da Computação'),
  '2025-01', null
),
(
  jsonb_build_object('en', 'IWTraining', 'pt', 'IWTraining'),
  jsonb_build_object('en', 'Certificate', 'pt', 'Certificado'),
  jsonb_build_object('en', 'Front End Development', 'pt', 'Desenvolvimento Front End'),
  '2018-01', '2019-03'
),
(
  jsonb_build_object('en', 'Centro Universitário Estácio do Ceará', 'pt', 'Centro Universitário Estácio do Ceará'),
  jsonb_build_object('en', 'Associate Degree', 'pt', 'Tecnólogo'),
  jsonb_build_object('en', 'Graphic Design', 'pt', 'Design Gráfico'),
  '2015-01', '2018-12'
);

-- ============================================
-- SKILLS
-- ============================================
delete from skills;

insert into skills (name, category) values
  (jsonb_build_object('en', 'ReactJS', 'pt', 'ReactJS'), 'frontend'),
  (jsonb_build_object('en', 'React Native', 'pt', 'React Native'), 'frontend'),
  (jsonb_build_object('en', 'TypeScript', 'pt', 'TypeScript'), 'frontend'),
  (jsonb_build_object('en', 'Next.js', 'pt', 'Next.js'), 'frontend'),
  (jsonb_build_object('en', 'AngularJS', 'pt', 'AngularJS'), 'frontend'),
  (jsonb_build_object('en', 'Node.js', 'pt', 'Node.js'), 'backend'),
  (jsonb_build_object('en', 'NestJS', 'pt', 'NestJS'), 'backend'),
  (jsonb_build_object('en', 'Python', 'pt', 'Python'), 'backend'),
  (jsonb_build_object('en', 'SQL', 'pt', 'SQL'), 'backend'),
  (jsonb_build_object('en', 'Docker', 'pt', 'Docker'), 'devops'),
  (jsonb_build_object('en', 'Git', 'pt', 'Git'), 'tools');

-- ============================================
-- PROJECTS
-- ============================================
delete from projects;

insert into projects (title, slug, description, "techStack", "liveUrl", "repoUrl", screenshots, status, "sortOrder") values
(
  jsonb_build_object('en', 'MecaPlanning Ecosystem', 'pt', 'Ecossistema MecaPlanning'),
  'mecaplanning',
  jsonb_build_object('en', 'A complete software ecosystem for automotive workshops. Manage clients, auto-calculate prices, deadlines, communications, and send alerts for vehicle recalls and additional services.',
    'pt', 'Uma coleção de softwares para oficinas mecânicas. Gerenciamento de clientes, preços automáticos, prazos, comunicações e alertas de recalls.'),
  array['ReactJS', 'TypeScript', 'Node.js', 'PostgreSQL']::text[],
  null, null, array[]::text[],
  'active', 0
),
(
  jsonb_build_object('en', 'Pinheiro Distribution Center', 'pt', 'Centro de Distribuição Pinheiro'),
  'pinheiro',
  jsonb_build_object('en', 'A logistics solution for a major supermarket franchise in Fortaleza. Reduced order processing time by 60% using a React Native app and ReactJS web dashboard.',
    'pt', 'Solução logística para uma grande franquia de supermercados em Fortaleza. Reduziu o tempo de processamento de pedidos em 60% com React Native e ReactJS.'),
  array['ReactJS', 'React Native', 'TypeScript', 'Node.js']::text[],
  null, null, array[]::text[],
  'active', 1
),
(
  jsonb_build_object('en', 'Vonixx Manufacturing', 'pt', 'Fabricação Vonixx'),
  'vonixx',
  jsonb_build_object('en', 'Web system for remote production management at a vehicle products manufacturer in Fortaleza. Tasks can be directed remotely with all necessary information available to factory workers.',
    'pt', 'Sistema web para gerenciamento remoto da produção em fabricante de produtos para veículos em Fortaleza. Tarefas direcionadas remotamente.'),
  array['ReactJS', 'TypeScript']::text[],
  null, null, array[]::text[],
  'active', 2
),
(
  jsonb_build_object('en', 'Browser Extension', 'pt', 'Extensão de Navegador'),
  'browser-extension',
  jsonb_build_object('en', 'A browser extension with over 6,000 daily active users. Built with ReactJS and TypeScript.',
    'pt', 'Extensão de navegador com mais de 6.000 usuários diários ativos. Desenvolvida com ReactJS e TypeScript.'),
  array['ReactJS', 'TypeScript']::text[],
  null, null, array[]::text[],
  'active', 3
);

-- ============================================
-- VERIFY
-- ============================================
select 'Profile:' as table_name, count(*) as rows from profile
union all select 'Experience:', count(*) from experience
union all select 'Education:', count(*) from education
union all select 'Skills:', count(*) from skills
union all select 'Projects:', count(*) from projects;
