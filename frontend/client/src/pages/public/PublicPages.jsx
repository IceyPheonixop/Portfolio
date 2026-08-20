import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, getImageUrl, formatUrl, getResumeUrls, downloadFile } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  ExternalLink,
  ArrowLeft,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Code2,
  FileCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  Sparkles,
} from 'lucide-react';

const Section = ({ title, children }) => (
  <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
    <p className="text-sm font-medium text-lime">PORTFOLIO</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
    {children}
  </section>
);

// --- Accurate Brand Logos ---
const PythonIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#3776AB" d="M11.927 0C6.012 0 6.376 2.56 6.376 2.56l.006 2.651h5.666v.8H3.974S0 5.56 0 11.492c0 5.933 3.469 5.728 3.469 5.728h2.072v-2.883s-.112-3.444 3.39-3.444h5.819s3.278.056 3.278-3.222V2.56S18.522 0 11.927 0zm-2.83 1.834a1.004 1.004 0 1 1 0 2.008 1.004 1.004 0 0 1 0-2.008z"/>
    <path fill="#FFD43B" d="M12.073 24c5.915 0 5.551-2.56 5.551-2.56l-.006-2.651H11.95v-.8h8.076s3.974.451 3.974-5.481c0-5.933-3.469-5.728-3.469-5.728h-2.072v2.883s.112 3.444-3.39 3.444H9.25s-3.278-.056-3.278 3.222v5.111S5.478 24 12.073 24zm2.83-1.834a1.004 1.004 0 1 1 0-2.008 1.004 1.004 0 0 1 0 2.008z"/>
  </svg>
);

const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width="20" height="20" fill="none">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" strokeWidth="1">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

const NodeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#68A063">
    <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-.83 20.574c-3.15-.355-4.473-2.03-4.473-4.457 0-2.482 1.488-3.959 4.316-4.225l1.62-.152v-1.61c0-1.127-.58-1.748-1.724-1.748-.962 0-1.57.447-1.826 1.342l-2.007-.94c.547-1.578 1.77-2.316 3.868-2.316 2.378 0 3.87 1.258 3.87 3.65v5.82h-1.884v-1.144h-.083c-.66.86-1.57 1.41-2.677 1.67v.11zm3.87-8.118l-1.536.14c-1.67.15-2.473.844-2.473 2.12 0 1.238.868 2.023 2.224 2.023.992 0 1.786-.547 1.786-1.53v-2.753z"/>
  </svg>
);

const JsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <rect width="24" height="24" rx="3" fill="#F7DF1E"/>
    <path fill="#000000" d="M6.45 18.66l1.83-1.1c.42.74.8 1.34 1.7 1.34.86 0 1.4-.42 1.4-1.48V9.88h2.32v7.58c0 2.28-1.34 3.28-3.56 3.28-2.04 0-3.16-1.06-3.69-2.08zm8.6-1.22l1.82-1.06c.5.82 1.18 1.44 2.26 1.44.98 0 1.62-.48 1.62-1.18 0-.82-.66-1.14-1.8-1.64l-.62-.28c-1.78-.76-2.96-1.72-2.96-3.78 0-1.88 1.44-3.3 3.68-3.3 1.6 0 2.76.56 3.54 1.94l-1.74 1.12c-.38-.64-.84-.94-1.7-.94-.8 0-1.34.48-1.34 1.08 0 .7.52.98 1.54 1.42l.62.26c2.1.9 3.24 1.86 3.24 3.96 0 2.26-1.76 3.48-4.14 3.48-2.3 0-3.64-1.12-4.42-2.46z"/>
  </svg>
);

const HtmlIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#E44D26" d="M1.5 0h21l-1.9 21.3L12 24l-8.6-2.7L1.5 0z"/>
    <path fill="#F16529" d="M12 22l7.1-2.2 1.6-17.8H12v20z"/>
    <path fill="#EBEBEB" d="M12 9.5H7.7l-.3-3.6H12V2.4H4.1l1 10.7H12V9.5zm0 6.6l-3.3-.9-.2-2.4H5.9l.4 4.5 5.7 1.6V16.1z"/>
    <path fill="#FFFFFF" d="M12 9.5h4.3l-.4 4.2-3.9 1.1v3.5l5.7-1.6.8-9.1.2-1.8h-6.7v3.7z"/>
  </svg>
);

const CssIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#1572B6" d="M1.5 0h21l-1.9 21.3L12 24l-8.6-2.7L1.5 0z"/>
    <path fill="#33A9DC" d="M12 22l7.1-2.2 1.6-17.8H12v20z"/>
    <path fill="#EBEBEB" d="M12 9.5H7.7l-.3-3.6H12V2.4H4.1l1 10.7H12V9.5zm0 6.6l-3.3-.9-.2-2.4H5.9l.4 4.5 5.7 1.6V16.1z"/>
    <path fill="#FFFFFF" d="M12 9.5h4.3l-.4 4.2-3.9 1.1v3.5l5.7-1.6.8-9.1.2-1.8h-6.7v3.7z"/>
  </svg>
);

const MongoIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#13AA52" d="M12 0C11.66 0 11.22.28 11.02.66c-.4 1.05-3.4 9.17-3.4 13.06 0 4.67 3.32 8.35 4.38 9.94.1.15.26.34.37.34.1 0 .28-.19.38-.34 1.06-1.59 4.38-5.27 4.38-9.94 0-3.89-3-12.01-3.4-13.06C12.55.28 12.34 0 12 0z"/>
    <path fill="#FFEAA5" d="M12 3.7c-.07.13-2.18 5.76-2.37 9.49 1.28.66 2.37.66 2.37.66V3.7z"/>
    <path fill="#13AA52" d="M12 3.7v10.45s1.09 0 2.37-.66c-.19-3.73-2.3-9.36-2.37-9.49z"/>
  </svg>
);

const SqlIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#00758F">
    <path d="M12 2C6.48 2 2 3.34 2 5v14c0 1.66 4.48 3 10 3s10-1.34 10-3V5c0-1.66-4.48-3-10-3zm0 2c4.42 0 8 .9 8 2s-3.58 2-8 2-8-.9-8-2 3.58-2 8-2zm8 5.26C18.67 10.14 15.54 11 12 11s-6.67-.86-8-1.74V7.68C5.6 8.7 8.65 9.33 12 9.33s6.4-.63 8-1.65v1.58zm0 4.67C18.67 14.81 15.54 15.67 12 15.67s-6.67-.86-8-1.74v-1.58c1.6 1.02 4.65 1.65 8 1.65s6.4-.63 8-1.65v1.58zm0 4.67C18.67 19.48 15.54 20.33 12 20.33s-6.67-.85-8-1.73v-1.6c1.6 1.02 4.65 1.67 8 1.67s6.4-.65 8-1.67v1.6z"/>
  </svg>
);

const ExcelIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#21A366" d="M15.5 2h-7v20h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    <path fill="#107C41" d="M8.5 2H3.5C2.4 2 1.5 2.9 1.5 4v16c0 1.1.9 2 2 2h5V2z"/>
    <path fill="#FFFFFF" d="M6.3 15.5l-1.5-3.3-1.5 3.3H1.8l2.4-4.8L1.9 6h1.6l1.4 3.1 1.4-3.1h1.5l-2.3 4.6 2.5 4.9H6.3z"/>
  </svg>
);

const PowerBiIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <rect x="2" y="11" width="4.5" height="11" rx="1.5" fill="#E6AD10"/>
    <rect x="8.5" y="6" width="4.5" height="16" rx="1.5" fill="#F2C811"/>
    <rect x="15" y="2" width="4.5" height="20" rx="1.5" fill="#F9E05E"/>
  </svg>
);

const TableauIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#EB6625" d="M11.2 1.5h1.6v3.2h-1.6zM11.2 19.3h1.6v3.2h-1.6zM1.5 11.2h3.2v1.6H1.5zM19.3 11.2h3.2v1.6h-3.2z"/>
    <path fill="#E8762D" d="M6.2 5.8h1.8v2.4H6.2zM16 5.8h1.8v2.4H16zM6.2 15.8h1.8v2.4H6.2zM16 15.8h1.8v2.4H16z"/>
    <path fill="#D92429" d="M10.8 7.5h2.4v9h-2.4z"/>
    <path fill="#E05226" d="M7.5 10.8h9v2.4h-9z"/>
  </svg>
);

function getPlatformIcon(name = '', url = '') {
  const target = `${name} ${url}`.toLowerCase();

  // Social & Platforms
  if (target.includes('linkedin')) return <Linkedin className="text-[#0A66C2]" size={22} />;
  if (target.includes('github')) return <Github className="text-white" size={22} />;
  if (target.includes('twitter') || target.includes('x.com')) return <Twitter className="text-[#1DA1F2]" size={22} />;
  if (target.includes('instagram')) return <Instagram className="text-[#E4405F]" size={22} />;
  if (target.includes('youtube')) return <Youtube className="text-[#FF0000]" size={22} />;
  if (target.includes('leetcode') || target.includes('codechef') || target.includes('hackerrank')) {
    return <Code2 className="text-amber-400" size={22} />;
  }

  // Skills
  if (target.includes('python')) return <PythonIcon />;
  if (target.includes('node')) return <NodeIcon />;
  if (target.includes('javascript') || target.includes('js')) return <JsIcon />;
  if (target.includes('react')) return <ReactIcon />;
  if (target.includes('html')) return <HtmlIcon />;
  if (target.includes('css')) return <CssIcon />;
  if (target.includes('mongo')) return <MongoIcon />;
  if (target.includes('sql') || target.includes('postgres') || target.includes('mysql') || target.includes('dbms')) return <SqlIcon />;
  if (target.includes('excel')) return <ExcelIcon />;
  if (target.includes('power bi') || target.includes('powerbi')) return <PowerBiIcon />;
  if (target.includes('tableau')) return <TableauIcon />;

  return <Globe className="text-lime" size={22} />;
}

export function Home() {
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);

  const techStack = [
    { name: 'React', icon: <ReactIcon /> },
    { name: 'Node.js', icon: <NodeIcon /> },
    { name: 'JavaScript', icon: <JsIcon /> },
    { name: 'Python', icon: <PythonIcon /> },
    { name: 'MongoDB', icon: <MongoIcon /> },
    { name: 'SQL', icon: <SqlIcon /> },
    { name: 'HTML5', icon: <HtmlIcon /> },
    { name: 'CSS3', icon: <CssIcon /> },
  ];

  useEffect(() => {
    let isMounted = true;
    api('/profile')
      .then((d) => {
        if (isMounted && d) setProfile(d.profile || d || {});
      })
      .catch(() => {});

    api('/projects')
      .then((d) => {
        if (isMounted && d?.projects) {
          setProjects(d.projects.filter((p) => p.featured));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -left-20 top-0 -z-10 h-96 w-96 rounded-full bg-lime/10 blur-3xl" />

        <Section
          title={
            <>
              Building thoughtful digital<br />
              <span className="text-lime">experiences.</span>
            </>
          }
        >
          {/* Live Status Badge */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3.5 py-1 text-xs font-mono text-lime">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime"></span>
            </span>
            {profile.availability || 'Available for new opportunities'}
          </div>

          {/* Clean Short Headline (Only 1-2 lines for home page) */}
          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            {profile.tagline || (
              <span>
                {profile.title ? `${profile.title} specialized in ` : 'Full Stack Developer specialized in '}
                building scalable web applications, modern responsive interfaces, and robust backend systems.
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/projects">
              Explore projects
            </Link>
            {profile.resume && (
              <a
                className="btn-secondary"
                href={getImageUrl(profile.resume)}
                target="_blank"
                rel="noreferrer"
              >
                View resume
              </a>
            )}
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
            <div>
              <div className="font-mono text-2xl font-bold text-white">4+</div>
              <div className="mt-0.5 text-xs uppercase tracking-wider text-zinc-500">Projects Built</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-lime">Full Stack</div>
              <div className="mt-0.5 text-xs uppercase tracking-wider text-zinc-500">MERN Stack</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-white">100%</div>
              <div className="mt-0.5 text-xs uppercase tracking-wider text-zinc-500">Clean Code</div>
            </div>
          </div>

          {/* Technologies Badges */}
          <div className="mt-8">
            <p className="mb-3 text-xs font-mono uppercase tracking-widest text-zinc-500">
              Technologies I work with
            </p>
            <div className="flex flex-wrap gap-2.5">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-lime/40 hover:text-white"
                >
                  <span className="scale-90">{tech.icon}</span>
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* Featured Projects Section */}
      <section className="border-y border-white/10 bg-white/[.02]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Featured work</h2>
            <Link to="/projects" className="text-sm font-medium text-lime hover:underline">
              View all &rarr;
            </Link>
          </div>

          <ProjectGrid projects={projects} />

          {/* Quick Contact Banner */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.05] to-white/[0.01] p-8 backdrop-blur-md md:flex-row">
            <div>
              <h3 className="text-xl font-bold text-white">Have a project in mind?</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Let’s collaborate and build something impactful together.
              </p>
            </div>
            <Link to="/contact" className="btn-primary shrink-0 px-6 py-3 font-semibold shadow-lg shadow-lime/10">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function Projects() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api('/projects')
      .then((d) => {
        if (isMounted) setProjects(d?.projects || []);
      })
      .catch(() => {
        if (isMounted) setProjects([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Section title="Selected projects">
      {projects === null ? (
        <Loader text="Loading projects…" />
      ) : projects.length ? (
        <ProjectGrid projects={projects} />
      ) : (
        <Empty text="No projects found." />
      )}
    </Section>
  );
}

export function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    api(`/projects/slug/${slug}`)
      .then((d) => {
        if (isMounted) setProject(d?.project || null);
      })
      .catch((e) => {
        if (isMounted) setError(e.message || 'Project not found');
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (error)
    return (
      <Section title="Project unavailable">
        <p className="mt-6 text-zinc-400">{error}</p>
      </Section>
    );

  if (!project) return <Loader text="Loading project…" />;

  return (
    <Section title={project.title}>
      <Link className="btn-secondary mt-6" to="/projects">
        <ArrowLeft size={16} /> Back to Projects
      </Link>
      
      {/* Uncropped Project Hero Image Preview */}
      {project.image && (
        <div className="mt-8 flex w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-4 backdrop-blur-sm">
          <img
            className="max-h-[580px] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            src={getImageUrl(project.image)}
            alt={project.title}
          />
        </div>
      )}

      <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
        <article className="space-y-7 text-zinc-300">
          <p className="text-lg">{project.shortDescription}</p>
          {[
            ['Overview', project.description],
            ['Problem', project.problemStatement],
            ['Solution', project.solution],
          ].map(
            ([h, v]) =>
              v && (
                <div key={h}>
                  <h2 className="mb-2 text-xl font-bold text-white">{h}</h2>
                  <p className="whitespace-pre-line leading-relaxed">{v}</p>
                </div>
              )
          )}
          {project.features?.length > 0 && (
            <div>
              <h2 className="mb-2 text-xl font-bold text-white">Features</h2>
              <ul className="list-inside list-disc space-y-1">
                {project.features.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
        <aside className="panel h-fit">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Technologies</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.technologies?.map((x) => (
              <span key={x} className="rounded-full bg-lime/10 px-3 py-1 text-xs text-lime">
                {x}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.githubUrl && (
              <a className="btn-secondary" href={project.githubUrl} target="_blank" rel="noreferrer">
                <Github size={16} /> GitHub
              </a>
            )}
            {project.liveDemoUrl && (
              <a className="btn-primary" href={project.liveDemoUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={16} /> Live demo
              </a>
            )}
          </div>
        </aside>
      </div>
      {project.gallery?.length > 0 && (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {project.gallery.map((i) => (
            <div
              key={i._id || i.url}
              className="flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-3"
            >
              <img
                className="max-h-[360px] w-auto max-w-full rounded-xl object-contain"
                src={getImageUrl(i)}
                alt="Project screenshot"
              />
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

export function ContentPage({ type, title }) {
  const [items, setItems] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api(`/${type}`)
      .then((d) => {
        if (isMounted) {
          const rawItems = Array.isArray(d) ? d : d?.items || [];
          setItems(rawItems);
        }
      })
      .catch(() => {
        if (isMounted) setItems([]);
      });

    return () => {
      isMounted = false;
    };
  }, [type]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Filter items matching search input
  const filteredItems = (items || []).filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const searchableText = [
      item.title,
      item.name,
      item.role,
      item.degree,
      item.issuer,
      item.company,
      item.institution,
      item.university,
      item.type,
      item.category,
      item.description,
      Array.isArray(item.technologies) ? item.technologies.join(' ') : item.technologies,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });

  return (
    <Section title={title}>
      {/* Search Bar */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()} (e.g. title, issuer, keyword)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-lime focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {items && items.length > 0 && (
          <span className="text-xs font-medium text-zinc-500">
            Showing {filteredItems.length} of {items.length} {title.toLowerCase()}
          </span>
        )}
      </div>

      {/* Grid Container */}
      {items === null ? (
        <Loader text={`Loading ${title.toLowerCase()}…`} />
      ) : filteredItems.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {filteredItems.map((x) => {
            const itemId = x._id || Math.random();
            const isExpanded = expandedId === itemId;
            const linkUrl = x.url || x.link || x.profileUrl || '';
            const mainTitle = x.role || x.title || x.degree || x.name || x.platform || '';
            const subTitle = x.company || x.institution || x.university || x.issuer || '';
            const searchKey = `${x.icon || ''} ${x.iconIdentifier || ''} ${mainTitle} ${subTitle}`;

            // Check if item contains extra details to show on expand
            const hasDetails = Boolean(
              x.description ||
              (Array.isArray(x.technologies) && x.technologies.length > 0) ||
              (typeof x.technologies === 'string' && x.technologies.trim().length > 0) ||
              (Array.isArray(x.responsibilities) && x.responsibilities.length > 0) ||
              (Array.isArray(x.achievements) && x.achievements.length > 0)
            );

            // Normalize technologies
            const techList = Array.isArray(x.technologies)
              ? x.technologies
              : typeof x.technologies === 'string' && x.technologies.trim().length > 0
              ? x.technologies.split(',').map((t) => t.trim())
              : [];

            return (
              <div
                className="panel flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all hover:border-white/20"
                key={itemId}
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5">
                        {getPlatformIcon(searchKey, linkUrl)}
                      </div>
                      <div>
                        <h2 className="font-semibold text-lg text-white capitalize">{mainTitle}</h2>
                        {subTitle && <p className="text-sm font-medium text-lime">{subTitle}</p>}
                      </div>
                    </div>

                    {/* Eye toggle button */}
                    {hasDetails && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(itemId)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          isExpanded
                            ? 'border-lime/60 bg-lime/10 text-lime'
                            : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                        }`}
                        title="View details"
                      >
                        <Eye size={14} className={isExpanded ? 'text-lime' : 'text-zinc-400'} />
                        {isExpanded ? 'Hide' : 'View'}
                      </button>
                    )}
                  </div>

                  {/* Metadata Chips (Duration, Category, Date, Type) */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {x.duration && (
                      <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
                        🗓️ {x.duration}
                      </span>
                    )}
                    {x.date && (
                      <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
                        🗓️ {x.date}
                      </span>
                    )}
                    {(x.startYear || x.endYear) && (
                      <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
                        🗓️ {x.startYear} - {x.endYear || 'Present'}
                      </span>
                    )}
                    {x.type && (
                      <span className="rounded-md border border-lime/20 bg-lime/5 px-2.5 py-1 text-xs text-lime capitalize">
                        {String(x.type)}
                      </span>
                    )}
                    {x.category && (
                      <span className="rounded-md border border-lime/20 bg-lime/5 px-2.5 py-1 text-xs text-lime capitalize">
                        {String(x.category)}
                      </span>
                    )}
                    {x.username && (
                      <span className="text-xs text-zinc-500">@{x.username}</span>
                    )}
                  </div>

                  {/* EXPANDED SECTION */}
                  {isExpanded && (
                    <div className="mt-5 space-y-4 border-t border-white/10 pt-4 animate-in fade-in duration-200">
                      {x.description && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Description
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
                            {x.description}
                          </p>
                        </div>
                      )}

                      {Array.isArray(x.responsibilities) && x.responsibilities.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Responsibilities
                          </p>
                          <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-zinc-300">
                            {x.responsibilities.map((resp, i) => (
                              <li key={i} className="leading-relaxed">{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(x.achievements) && x.achievements.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Achievements
                          </p>
                          <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-zinc-300">
                            {x.achievements.map((ach, i) => (
                              <li key={i} className="leading-relaxed">{ach}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {techList.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Technologies Used
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {techList.map((tech, i) => (
                              <span
                                key={i}
                                className="rounded-full border border-lime/20 bg-lime/5 px-2.5 py-0.5 text-xs text-lime"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Links (Certificates & Social URLs) */}
                <div className="mt-5 space-y-2 border-t border-white/10 pt-3">
                  {/* Certificate Link */}
                  {x.image?.url && (
                    <a
                      href={getImageUrl(x.image)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-lime transition-opacity hover:opacity-80"
                    >
                      <FileCheck size={14} /> View Certificate <ExternalLink size={12} />
                    </a>
                  )}

                  {/* External/Profile Link */}
                  {linkUrl && (
                    <div>
                      <a
                        href={formatUrl(linkUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-lime transition-opacity hover:opacity-80"
                      >
                        Visit link <ExternalLink size={13} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty
          text={
            searchQuery
              ? `No ${title.toLowerCase()} found matching "${searchQuery}".`
              : `No ${title.toLowerCase()} added yet.`
          }
        />
      )}
    </Section>
  );
}

export function About() {
  const [p, setProfile] = useState({});

  useEffect(() => {
    let isMounted = true;
    api('/profile')
      .then((d) => {
        if (isMounted && d) setProfile(d.profile || d || {});
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const { viewUrl } = getResumeUrls(p?.resume);

  const handleDownload = (e) => {
    e.preventDefault();
    if (viewUrl) {
      downloadFile(viewUrl, `${p?.name ? p.name.replace(/\s+/g, '_') : 'Resume'}_CV.pdf`);
    }
  };

  // Pehle aboutImage dekhega, agar nahi hai toh fallback ke liye image use karega
  const displayImage = p?.aboutImage || p?.image;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* Left Column: Details */}
        <div className="flex flex-col items-start space-y-6">
          <p className="text-sm font-medium uppercase tracking-wider text-lime">Portfolio</p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About me
          </h1>

          {/* Full Bio for About Page */}
          <div className="whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg">
            {p?.bio || 'This profile is ready to be customized in the secure admin dashboard.'}
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-400">
            {p?.email && (
              <span className="flex items-center gap-2">
                <Mail size={16} className="text-lime" /> {p.email}
              </span>
            )}
            {p?.location && (
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-lime" /> {p.location}
              </span>
            )}
          </div>

          {viewUrl && (
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
              >
                <Eye size={16} className="text-lime" /> View resume
              </a>

              <button
                type="button"
                onClick={handleDownload}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              >
                <Download size={16} /> Download resume
              </button>
            </div>
          )}
        </div>

        {/* Right Column: About Page Specific Image */}
        {displayImage && (
          <div className="flex justify-center lg:justify-end">
            <div className="group relative w-full max-w-[340px] sm:max-w-[380px]">
              <div className="absolute -inset-1 rounded-3xl bg-lime/20 blur-xl transition duration-500 group-hover:bg-lime/30" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-md transition duration-300 hover:border-lime/50 shadow-2xl">
                <img
                  src={getImageUrl(displayImage)}
                  alt={p.name || 'About Me'}
                  className="aspect-[4/5] w-full rounded-2xl object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x500?text=About+Photo';
                  }}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export function Contact() {
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    let isMounted = true;
    api('/profile')
      .then((d) => {
        if (isMounted && d) setProfile(d.profile || d || {});
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      await api('/messages', {
        method: 'POST',
        body: formData,
      });

      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <Section title="Let’s work together">
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        
        {/* Left Column: Direct Info Cards */}
        <div className="space-y-6">
          <p className="text-base text-zinc-300 leading-relaxed">
            Have a project in mind, a question, or an opportunity? Feel free to reach out directly through the form or using the details below.
          </p>

          <div className="space-y-4 pt-2">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="panel flex items-center gap-4 transition-all hover:border-lime/40 group"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-lime group-hover:bg-lime group-hover:text-black transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">Email</p>
                  <p className="font-medium text-white">{profile.email}</p>
                </div>
              </a>
            )}

            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="panel flex items-center gap-4 transition-all hover:border-lime/40 group"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-lime group-hover:bg-lime group-hover:text-black transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">Phone</p>
                  <p className="font-medium text-white">{profile.phone}</p>
                </div>
              </a>
            )}

            {profile.location && (
              <div className="panel flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-lime">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">Location</p>
                  <p className="font-medium text-white">{profile.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="panel relative p-8">
          {status.success && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-lime/30 bg-lime/10 p-4 text-sm text-lime">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>Thank you! Your message has been sent successfully.</span>
            </div>
          )}

          {status.error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle size={18} className="shrink-0" />
              <span>{status.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label text-xs uppercase tracking-wider text-zinc-400">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-lime focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="label text-xs uppercase tracking-wider text-zinc-400">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-lime focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="label text-xs uppercase tracking-wider text-zinc-400">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Project discussion / Freelance inquiry"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-lime focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="label text-xs uppercase tracking-wider text-zinc-400">Message</label>
              <textarea
                name="message"
                required
                rows="5"
                placeholder="Write your message details here..."
                value={formData.message}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-lime focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3 font-semibold mt-2"
            >
              {status.loading ? (
                'Sending...'
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}

function ProjectGrid({ projects }) {
  return (
    <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((p, i) => (
        <motion.article
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass overflow-hidden rounded-2xl flex flex-col justify-between"
          key={p._id || i}
        >
          {/* Card Hero Image Container */}
          {p.image ? (
            <div className="flex h-52 w-full items-center justify-center border-b border-white/10 bg-zinc-950/70 p-3">
              <img
                className="max-h-full w-auto max-w-full rounded-lg object-contain transition-transform duration-300 hover:scale-[1.02]"
                src={getImageUrl(p.image)}
                alt={p.title}
              />
            </div>
          ) : (
            <div className="h-52 bg-gradient-to-br from-lime/20 to-indigo-500/20" />
          )}

          <div className="p-5 flex flex-col flex-1 justify-between">
            <div>
              <p className="text-xs text-lime font-medium uppercase tracking-wider">{p.category}</p>
              <h2 className="mt-1 text-lg font-bold text-white">{p.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{p.shortDescription}</p>
            </div>

            <div className="mt-5 flex gap-2 pt-2 border-t border-white/5">
              <Link to={`/projects/${p.slug}`} className="btn-secondary px-3 py-2 text-xs flex-1 text-center">
                Details
              </Link>
              {p.liveDemoUrl && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={p.liveDemoUrl}
                  className="btn-primary px-3 py-2 text-xs flex-1 text-center"
                >
                  <ExternalLink size={14} className="inline mr-1" /> Demo
                </a>
              )}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function Empty({ text }) {
  return <div className="panel mt-8 text-center text-zinc-400">{text}</div>;
}
