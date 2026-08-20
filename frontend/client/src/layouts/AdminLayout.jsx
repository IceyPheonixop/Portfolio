import { NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  FolderKanban,
  UserRound,
  Share2,
  Code2,
  BriefcaseBusiness,
  GraduationCap,
  Trophy,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  ['Dashboard', '/admin', LayoutDashboard],
  ['Inbox', '/admin/messages', Mail],
  ['Projects', '/admin/projects', FolderKanban],
  ['Profile & About', '/admin/profile', UserRound],
  ['Social links', '/admin/social', Share2],
  ['Skills', '/admin/skills', Code2],
  ['Experience', '/admin/experience', BriefcaseBusiness],
  ['Education', '/admin/education', GraduationCap],
  ['Achievements', '/admin/achievements', Trophy],
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-zinc-950 md:flex">
      <aside className="border-b border-white/10 p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <p className="mb-7 text-sm font-bold tracking-widest text-lime">ADMIN PANEL</p>
        <nav className="flex gap-1 overflow-x-auto md:block md:space-y-1">
          {links.map(([label, to, Icon]) => (
            <NavLink
              end={to === '/admin'}
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-lime/15 text-lime'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={17} />
          Logout
        </button>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-9">
        <Outlet />
      </main>
    </div>
  );
}