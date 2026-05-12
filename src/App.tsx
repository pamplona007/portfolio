import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLoader } from './components/public/AppLoader';

// Public pages (lazy loaded)
const Home = React.lazy(() => import('./pages/public/Home'));
const About = React.lazy(() => import('./pages/public/About'));
const Projects = React.lazy(() => import('./pages/public/Projects'));
const Contact = React.lazy(() => import('./pages/public/Contact'));

// Layouts
import { PublicLayout } from './components/public/Layout';

export default function App() {
  return (
    <AppLoader>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </AppLoader>
  );
}
