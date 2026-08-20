import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, getImageUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2, Search, Upload } from 'lucide-react';

const categories = [
  'Web Development',
  'Full Stack',
  'MERN',
  'Python',
  'Data Analytics',
  'AI/ML',
  'IoT',
  'Other',
];

const field = (name, label, type = 'text') => ({ name, label, type });

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      nav('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink p-4">
      <form onSubmit={submit} className="panel w-full max-w-md">
        <p className="text-sm tracking-[.25em] text-lime">PRIVATE AREA</p>
        <h1 className="mt-2 text-2xl font-bold">Admin login</h1>
        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <label className="label mt-6">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label className="label mt-4">Password</label>
        <input
          type="password"
          minLength="6"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api('/projects/admin/all?limit=100')
      .then((d) => {
        if (isMounted) {
          setData(Array.isArray(d) ? d : d?.projects || []);
        }
      })
      .catch((err) => {
        console.error('Dashboard load error:', err);
        if (isMounted) setData([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Loader />;

  const count = (predicate) => data.filter((p) => predicate(p)).length;

  return (
    <>
      <p className="text-sm font-medium text-lime">OVERVIEW</p>
      <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total projects', data.length],
          ['Published', count((p) => p.status === 'published')],
          ['Drafts', count((p) => p.status === 'draft')],
          ['Featured', count((p) => !!p.featured)],
        ].map(([a, b]) => (
          <div className="panel" key={a}>
            <p className="text-sm text-zinc-400">{a}</p>
            <p className="mt-2 text-3xl font-bold">{b}</p>
          </div>
        ))}
      </div>
      <div className="panel mt-7">
        <h2 className="font-bold">Recent projects</h2>
        {data.slice(0, 5).map((p) => (
          <div
            className="mt-3 flex justify-between border-t border-white/10 pt-3 text-sm"
            key={p._id || p.title}
          >
            <span>{p.title}</span>
            <span
              className={
                p.status === 'published' ? 'text-lime' : 'text-amber-300'
              }
            >
              {p.status || 'draft'}
            </span>
          </div>
        ))}
        {!data.length && (
          <p className="mt-3 text-sm text-zinc-400">No projects added yet.</p>
        )}
      </div>
    </>
  );
}

export function ProjectsAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api(`/projects/admin/all?search=${encodeURIComponent(search)}&limit=100`)
      .then((d) => {
        setData(Array.isArray(d) ? d : d?.projects || []);
      })
      .catch((e) => setError(e.message || 'Failed to load projects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [search]);

  const del = async () => {
    try {
      await api(`/projects/${confirm._id}`, { method: 'DELETE' });
      setConfirm(null);
      load();
    } catch (e) {
      setError(e.message || 'Failed to delete project');
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-lime">CONTENT</p>
          <h1 className="text-3xl font-bold">Projects</h1>
        </div>
        <Link className="btn-primary" to="/admin/projects/new">
          <Plus size={17} />
          Add project
        </Link>
      </div>
      <div className="mt-6 flex max-w-md items-center gap-2 rounded-xl border border-white/10 px-3">
        <Search size={17} />
        <input
          className="border-0 bg-transparent"
          placeholder="Search projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {error && <p className="mt-4 text-red-300">{error}</p>}
      {loading ? (
        <Loader />
      ) : (
        <div className="panel mt-5 overflow-x-auto p-0">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-white/10 text-zinc-400">
              <tr>
                {[
                  'Project',
                  'Category',
                  'Status',
                  'Featured',
                  'Updated',
                  'Actions',
                ].map((x) => (
                  <th className="p-4 font-medium" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p._id} className="border-b border-white/5">
                  <td className="p-4 font-medium">{p.title}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 capitalize">{p.status || 'draft'}</td>
                  <td className="p-4">{p.featured ? 'Yes' : 'No'}</td>
                  <td className="p-4">
                    {p.updatedAt
                      ? new Date(p.updatedAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        className="btn-secondary p-2"
                        to={`/admin/projects/${p._id}/edit`}
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        className="btn bg-red-500/15 p-2 text-red-300"
                        onClick={() => setConfirm(p)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data.length && (
            <p className="p-8 text-center text-zinc-400">
              No projects found.{' '}
              <Link className="text-lime" to="/admin/projects/new">
                Add your first project
              </Link>
            </p>
          )}
        </div>
      )}
      <ConfirmDialog
        open={!!confirm}
        title="Delete project?"
        onCancel={() => setConfirm(null)}
        onConfirm={del}
      >
        Are you sure you want to permanently delete “{confirm?.title}”? This
        action cannot be undone.
      </ConfirmDialog>
    </>
  );
}

export function ProjectForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    problemStatement: '',
    solution: '',
    features: '',
    technologies: '',
    category: categories[0],
    githubUrl: '',
    liveDemoUrl: '',
    status: 'published',
    featured: false,
    order: 0,
  });
  const [image, setImage] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      api(`/projects/admin/${id}`)
        .then((res) => {
          const project = res?.project || res;
          if (project) {
            setCurrent(project);
            setForm({
              ...project,
              features: Array.isArray(project.features)
                ? project.features.join('\n')
                : project.features || '',
              technologies: Array.isArray(project.technologies)
                ? project.technologies.join(', ')
                : project.technologies || '',
            });
          }
        })
        .catch((e) => setError(e.message || 'Failed to load project'));
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const fd = new FormData();

    // Prepare features & technologies arrays
    const formattedFeatures = form.features
      ? form.features.split('\n').map((x) => x.trim()).filter(Boolean)
      : [];
    const formattedTechnologies = form.technologies
      ? form.technologies.split(',').map((x) => x.trim()).filter(Boolean)
      : [];

    const payload = {
      ...form,
      features: JSON.stringify(formattedFeatures),
      technologies: JSON.stringify(formattedTechnologies),
      featured: String(form.featured),
      order: String(form.order || 0),
    };

    // Append text fields safely
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null && k !== 'image' && k !== 'gallery') {
        fd.append(k, v);
      }
    });

    if (image) fd.append('image', image);
    if (gallery) {
      Array.from(gallery).forEach((file) => fd.append('gallery', file));
    }

    try {
      await api(id ? `/projects/${id}` : '/projects', {
        method: id ? 'PUT' : 'POST',
        body: fd,
      });
      nav('/admin/projects');
    } catch (err) {
      console.error('Save project error:', err);
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const removeGallery = async (asset) => {
    try {
      await api(`/projects/${id}/gallery/${asset._id}`, { method: 'DELETE' });
      setCurrent({
        ...current,
        gallery: current.gallery.filter((x) => x._id !== asset._id),
      });
    } catch (err) {
      setError(err.message || 'Failed to remove image');
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl">
      <p className="text-sm text-lime">PROJECT</p>
      <h1 className="text-3xl font-bold">{id ? 'Edit project' : 'Add project'}</h1>
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <div className="panel mt-6 grid gap-4 md:grid-cols-2">
        {[
          field('title', 'Title'),
          field('shortDescription', 'Short description'),
          field('githubUrl', 'GitHub URL', 'url'),
          field('liveDemoUrl', 'Live demo URL', 'url'),
          field('order', 'Display order', 'number'),
        ].map((f) => (
          <label
            key={f.name}
            className={f.name === 'shortDescription' ? 'md:col-span-2' : ''}
          >
            <span className="label">
              {f.label}
              {['title', 'shortDescription'].includes(f.name) && ' *'}
            </span>
            <input
              required={['title', 'shortDescription'].includes(f.name)}
              type={f.type}
              value={form[f.name] ?? ''}
              onChange={(e) =>
                setForm({ ...form, [f.name]: e.target.value })
              }
            />
          </label>
        ))}
        <label>
          <span className="label">Category *</span>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((x) => (
              <option className="bg-zinc-900" key={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label className="flex items-end gap-2 pb-2">
          <input
            className="w-auto"
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured on home
        </label>
      </div>

      <div className="panel mt-5 space-y-4">
        {['description', 'problemStatement', 'solution', 'features'].map((x) => (
          <label key={x}>
            <span className="label">
              {x === 'features'
                ? 'Features (one per line)'
                : x.replace(/([A-Z])/g, ' $1')}
            </span>
            <textarea
              rows="4"
              value={form[x] ?? ''}
              onChange={(e) => setForm({ ...form, [x]: e.target.value })}
            />
          </label>
        ))}
        <label>
          <span className="label">Technologies (comma-separated)</span>
          <input
            placeholder="React, Node.js, Express, MongoDB, Tailwind"
            value={form.technologies ?? ''}
            onChange={(e) =>
              setForm({ ...form, technologies: e.target.value })
            }
          />
        </label>
      </div>

      <div className="panel mt-5">
        <label className="label">
          <Upload className="mr-2 inline" size={14} />
          Hero image (JPG, PNG, WebP)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {current?.image?.url && (
          <img
            className="mt-4 h-32 rounded-xl object-cover"
            src={getImageUrl(current.image)}
            alt="Current project preview"
          />
        )}
        <label className="label mt-5">Gallery images</label>
        <input
          multiple
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setGallery(e.target.files)}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          {current?.gallery?.map((a) => (
            <div className="relative" key={a._id}>
              <img
                className="h-20 w-28 rounded-lg object-cover"
                src={getImageUrl(a)}
                alt="Gallery item"
              />
              <button
                type="button"
                onClick={() => removeGallery(a)}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button disabled={saving} className="btn-primary mt-6">
        {saving ? 'Saving project…' : id ? 'Update project' : 'Create project'}
      </button>
    </form>
  );
}