import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import MessagesAdmin from './pages/admin/MessagesAdmin';
import {
  Home,
  About,
  Projects,
  ProjectDetail,
  ContentPage,
  Contact,
} from './pages/public/PublicPages';
import {
  Login,
  Dashboard,
  ProjectsAdmin,
  ProjectForm,
} from './pages/admin/AdminPages';
import { ContentManager, ProfileAdmin } from './pages/admin/ContentPages';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<ContentPage type="skills" title="Skills" />} />
        <Route path="experience" element={<ContentPage type="experience" title="Experience" />} />
        <Route path="education" element={<ContentPage type="education" title="Education" />} />
        <Route path="achievements" element={<ContentPage type="achievements" title="Achievements" />} />
        <Route path="social" element={<ContentPage type="social" title="Social media" />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin Login Route */}
      <Route path="admin/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="social" element={<ContentManager type="social" />} />
        <Route path="skills" element={<ContentManager type="skills" />} />
        <Route path="experience" element={<ContentManager type="experience" />} />
        <Route path="education" element={<ContentManager type="education" />} />
        <Route path="achievements" element={<ContentManager type="achievements" />} />
        <Route path="settings" element={<ProfileAdmin />} />
      </Route>
    </Routes>
  );
}