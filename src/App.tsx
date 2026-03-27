import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AppLoader } from './components/public/AppLoader';

// Public pages (lazy loaded)
const Home = React.lazy(() => import('./pages/public/Home'));
const About = React.lazy(() => import('./pages/public/About'));
const Projects = React.lazy(() => import('./pages/public/Projects'));
const Contact = React.lazy(() => import('./pages/public/Contact'));

// Admin pages (lazy loaded)
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Login = React.lazy(() => import('./pages/admin/Login'));
const AboutEditor = React.lazy(() => import('./pages/admin/AboutEditor'));
const ProjectsEditor = React.lazy(() => import('./pages/admin/ProjectsEditor'));
const ContactSubmissions = React.lazy(() => import('./pages/admin/ContactSubmissions'));
const Settings = React.lazy(() => import('./pages/admin/Settings'));
const SkillsEditor = React.lazy(() => import('./components/admin/SkillsEditor'));

// Layouts
import { PublicLayout } from './components/public/Layout';
import { DashboardLayout } from './components/admin/DashboardLayout';

export default function App() {
  return (
    <AppLoader>
      <React.Suspense fallback={null}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/dashboard/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="contact" element={<ContactSubmissions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="skills" element={<SkillsEditor />} />
          </Route>
        </Routes>
      </React.Suspense>
    </AppLoader>
  );
}
