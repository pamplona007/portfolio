import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

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

// Layouts
import { PublicLayout } from './components/public/Layout';
import { DashboardLayout } from './components/admin/DashboardLayout';

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      color: 'var(--color-text-secondary)'
    }}>
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin routes */}
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
        </Route>
      </Routes>
    </React.Suspense>
  );
}
