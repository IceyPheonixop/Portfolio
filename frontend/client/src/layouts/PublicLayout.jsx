import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Code2, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, getImageUrl } from '../services/api';

const nav = [
  ['Home', '/'],
  ['About', '/about'],
  ['Skills', '/skills'],
  ['Experience', '/experience'],
  ['Education', '/education'],
  ['Projects', '/projects'],
  ['Achievements', '/achievements'],
  ['Social Media', '/social'],
  ['Contact', '/contact'],
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api('/profile')
      .then((d) => {
        if (isMounted) setProfile(d?.profile || d || {});
      })
      .catch(() => {
        if (isMounted) setProfile({});
      });

    api('/projects')
      .then((d) => {
        if (isMounted) {
          if (Array.isArray(d)) {
            setProjects(d);
          } else if (Array.isArray(d?.projects)) {
            setProjects(d.projects);
          } else {
            setProjects([]);
          }
        }
      })
      .catch(() => {
        if (isMounted) setProjects([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-zinc-950/95 p-5 backdrop-blur-xl">
      {/* 1. SIDEBAR PROFILE AVATAR (Small Photo) */}
      <NavLink to="/" className="mb-8 flex items-center gap-3">
        {profile?.image ? (
          <img
            src={getImageUrl(profile.image)}
            alt={profile?.name || 'Profile Avatar'}
            className="h-11 w-11 rounded-full object-cover border border-lime/40 shadow-sm"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="grid h-11 w-11 place-items-center rounded-full bg-lime/20 text-lime font-bold border border-lime/40">
            <Code2 size={20} />
          </div>
        )}
        <div>
          <p className="font-bold text-white leading-tight">{profile?.name || 'Your Name'}</p>
          <p className="text-xs text-zinc-400 mt-0.5">{profile?.title || 'Developer'}</p>
        </div>
      </NavLink>

      {/* Live Availability Indicator */}
      <p className="mb-5 flex items-center gap-2 text-xs text-lime font-mono">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-lime"></span>
        </span>
        {profile?.availability || 'Open to opportunities'}
      </p>

      {/* Navigation Links */}
      <nav className="space-y-1 overflow-y-auto pr-1">
        {nav.map(([label, to]) => (
          <NavLink
            onClick={() => setOpen(false)}
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `block rounded-xl px-3.5 py-2 text-sm transition-all ${
                isActive
                  ? 'bg-lime/10 text-lime font-semibold border border-lime/20'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}

        {/* Dynamic Project List */}
        {projects?.length > 0 && (
          <div className="pt-5 mt-2 border-t border-white/5">
            <p className="px-3 text-xs font-mono font-semibold tracking-widest text-zinc-500 uppercase">
              Projects
            </p>
            <div className="mt-2 space-y-1">
              {projects.map((p) => (
                <NavLink
                  onClick={() => setOpen(false)}
                  key={p._id || p.slug || p.title}
                  to={`/projects/${p.slug || p._id}`}
                  className={({ isActive }) =>
                    `block px-3 py-1.5 text-xs transition-colors rounded-lg ${
                      isActive
                        ? 'text-lime font-medium bg-lime/5'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {p.title}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Admin Login Shortcut */}
      <NavLink
        to="/admin/login"
        className="btn-secondary mt-auto text-center text-xs py-2 text-zinc-500 hover:text-white"
      >
        Admin login
      </NavLink>
    </aside>
  );

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-40 rounded-xl border border-white/10 bg-zinc-900/90 p-3 backdrop-blur-md lg:hidden text-white"
        aria-label="Toggle navigation"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{sidebar}</div>

      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="h-full w-72">
            {sidebar}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="min-h-screen lg:ml-72">
        <Outlet />
      </main>
    </div>
  );
}
