import { useEffect, useState } from 'react';
import { api, getImageUrl } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Trash2, Pencil, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';

const configs = {
  social: {
    title: 'Social links',
    fields: [
      ['platform', 'Platform (e.g. LinkedIn, Twitter, GitHub)'],
      ['username', 'Username'],
      ['url', 'URL (e.g. https://linkedin.com/in/...)', 'url'],
    ],
  },
  skills: {
    title: 'Skills',
    fields: [
      ['name', 'Skill Name'],
      ['category', 'Category (Frontend, Backend, Tools, Database)'],
      ['icon', 'Icon identifier'],
    ],
  },
  experience: {
    title: 'Experience',
    fields: [
      ['company', 'Company'],
      ['role', 'Role'],
      ['duration', 'Duration (e.g. Jan 2024 - Present)'],
      ['technologies', 'Technologies (comma-separated)'],
      ['description', 'Description'],
    ],
  },
  education: {
    title: 'Education',
    fields: [
      ['degree', 'Degree / Program'],
      ['institution', 'Institution / College'],
      ['university', 'University'],
      ['startYear', 'Start year', 'number'],
      ['endYear', 'End year', 'number'],
      ['description', 'Description'],
    ],
  },
  achievements: {
    title: 'Achievements',
    fields: [
      ['title', 'Title'],
      ['type', 'Type / Category'],
      ['issuer', 'Issuer / Organization'],
      ['date', 'Date'],
      ['description', 'Description'],
    ],
  },
};

export function ContentManager({ type }) {
  const c = configs[type] || { title: 'Items', fields: [] };
  const empty = Object.fromEntries(c.fields.map(([n]) => [n, '']));
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [certificateFile, setCertificateFile] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api(`/${type}`)
      .then((d) => {
        if (Array.isArray(d)) {
          setItems(d);
        } else if (Array.isArray(d?.items)) {
          setItems(d.items);
        } else {
          setItems([]);
        }
      })
      .catch((e) => setError(e.message || 'Failed to load items'));
  };

  useEffect(() => {
    load();
    setForm(empty);
    setCertificateFile(null);
    setEditing(null);
    setError('');
  }, [type]);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (type === 'achievements') {
        const fd = new FormData();
        Object.entries(form).forEach(([key, val]) => {
          if (val !== undefined && val !== null) fd.append(key, val);
        });
        if (certificateFile) {
          fd.append('certificate', certificateFile);
        }

        if (editing && editing._id) {
          await api(`/${type}/${editing._id}`, { method: 'PUT', body: fd });
        } else {
          await api(`/${type}`, { method: 'POST', body: fd });
        }
      } else {
        const data = { ...form };

        // Handle comma-separated technologies array
        if (typeof data.technologies === 'string') {
          data.technologies = data.technologies
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean);
        }

        // Convert education years to proper Numbers or null
        if (type === 'education') {
          data.startYear = data.startYear ? Number(data.startYear) : undefined;
          data.endYear = data.endYear ? Number(data.endYear) : undefined;
        }

        // Automatically capitalize category for skills
        if (type === 'skills' && data.category) {
          data.category = data.category.trim().charAt(0).toUpperCase() + data.category.trim().slice(1);
        }

        if (editing && editing._id) {
          await api(`/${type}/${editing._id}`, { method: 'PUT', body: data });
        } else {
          await api(`/${type}`, { method: 'POST', body: data });
        }
      }

      setEditing(null);
      setCertificateFile(null);
      setForm(empty);
      load();
    } catch (e) {
      setError(e.message || 'Failed to save item');
    }
  };

  const edit = (x) => {
    setEditing(x);
    setCertificateFile(null);
    const populated = {};
    c.fields.forEach(([key]) => {
      if (key === 'technologies' && Array.isArray(x[key])) {
        populated[key] = x[key].join(', ');
      } else {
        populated[key] = x[key] ?? '';
      }
    });
    setForm(populated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async () => {
    try {
      await api(`/${type}/${confirm._id}`, { method: 'DELETE' });
      setConfirm(null);
      load();
    } catch (e) {
      setError(e.message || 'Failed to delete item');
    }
  };

  return (
    <>
      <p className="text-sm font-semibold tracking-wider text-lime">CONTENT</p>
      <h1 className="text-3xl font-bold text-white">{c.title}</h1>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <form className="panel h-fit" onSubmit={save}>
          <h2 className="text-lg font-bold text-white">
            {editing ? 'Edit' : 'Add'} {c.title.replace(/s$/, '')}
          </h2>

          {c.fields.map(([name, label, kind]) => (
            <label className="mt-4 block" key={name}>
              <span className="label text-xs uppercase tracking-wider text-zinc-400">{label}</span>
              {name === 'description' ? (
                <textarea
                  rows="4"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-lime focus:outline-none"
                  value={form[name] || ''}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                />
              ) : (
                <input
                  required={['name', 'title', 'platform', 'company', 'degree'].includes(name)}
                  type={kind || 'text'}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-lime focus:outline-none"
                  value={form[name] ?? ''}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                />
              )}
            </label>
          ))}

          {/* Certificate upload field on Achievements form */}
          {type === 'achievements' && (
            <label className="mt-4 block">
              <span className="label text-xs uppercase tracking-wider text-zinc-400">
                Certificate File (PDF or Image)
              </span>
              <input
                type="file"
                accept="application/pdf,image/*"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20"
                onChange={(e) => setCertificateFile(e.target.files[0])}
              />
              {editing?.image?.url && (
                <a
                  href={getImageUrl(editing.image)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-lime hover:underline"
                >
                  <FileText size={13} /> View current certificate <ExternalLink size={11} />
                </a>
              )}
            </label>
          )}

          <div className="mt-5 flex gap-2">
            <button className="btn-primary flex-1">
              {editing ? 'Update' : 'Add'} item
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setCertificateFile(null);
                  setForm(empty);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {items.map((x) => (
            <div
              className="panel flex items-center justify-between"
              key={x._id || Math.random()}
            >
              <div>
                <p className="font-semibold text-white">
                  {x.degree || x.role || x.name || x.title || x.platform}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {x.institution ||
                    x.university ||
                    x.company ||
                    x.category ||
                    x.type ||
                    x.url ||
                    x.issuer ||
                    ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {x.image?.url && (
                  <a
                    href={getImageUrl(x.image)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary p-2 text-lime hover:text-white"
                    title="View certificate"
                  >
                    <FileText size={15} />
                  </a>
                )}
                <button
                  className="btn-secondary p-2 text-zinc-300 hover:text-white"
                  onClick={() => edit(x)}
                  title="Edit item"
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="btn bg-red-500/15 p-2 text-red-400 hover:bg-red-500/25"
                  onClick={() => setConfirm(x)}
                  title="Delete item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {!items.length && (
            <div className="panel text-center text-zinc-500">No items added yet.</div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm}
        title="Delete item?"
        onCancel={() => setConfirm(null)}
        onConfirm={del}
      >
        This action cannot be undone.
      </ConfirmDialog>
    </>
  );
}

export function ProfileAdmin() {
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [aboutImage, setAboutImage] = useState(null);
  const [aboutImagePreview, setAboutImagePreview] = useState('');
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api('/profile')
      .then((d) => {
        if (isMounted && d) {
          const profileData = d.profile || d || {};
          setForm(profileData);
          if (profileData.image) {
            setImagePreview(getImageUrl(profileData.image));
          }
          if (profileData.aboutImage) {
            setAboutImagePreview(getImageUrl(profileData.aboutImage));
          }
        }
      })
      .catch((e) => console.error(e));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAboutImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAboutImage(file);
      setAboutImagePreview(URL.createObjectURL(file));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const fd = new FormData();
    [
      'name',
      'title',
      'tagline',
      'bio',
      'email',
      'phone',
      'location',
      'availability',
      'githubUsername',
    ].forEach((x) => fd.append(x, form[x] || ''));

    if (image) fd.append('image', image);
    if (aboutImage) fd.append('aboutImage', aboutImage);
    if (resume) fd.append('resume', resume);

    try {
      const d = await api('/profile', { method: 'PUT', body: fd });
      setForm(d.profile || d);
      setMessage('Profile & About Me saved successfully.');
    } catch (e) {
      setMessage(e.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-4xl">
      <p className="text-sm font-semibold tracking-wider text-lime">CONTENT</p>
      <h1 className="text-3xl font-bold text-white">Profile & About Me</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Update your personal tagline, about bio, contact info, resume, and profile photos for the public pages.
      </p>

      {message && (
        <p
          className={`mt-4 rounded-xl p-3 text-sm ${
            message.includes('success')
              ? 'border border-lime/20 bg-lime/10 text-lime'
              : 'border border-red-500/20 bg-red-500/10 text-red-400'
          }`}
        >
          {message}
        </p>
      )}

      <div className="panel mt-6 grid gap-5 md:grid-cols-2">
        {[
          ['name', 'Full Name'],
          ['title', 'Professional Title (e.g. Full Stack Developer)'],
          ['email', 'Email Address', 'email'],
          ['phone', 'Phone Number'],
          ['location', 'Location (City, Country)'],
          ['availability', 'Availability Status (e.g. Open to opportunities)'],
          ['githubUsername', 'GitHub Username'],
        ].map(([n, l, t]) => (
          <label key={n}>
            <span className="label text-xs uppercase tracking-wider text-zinc-400">{l}</span>
            <input
              type={t || 'text'}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-lime focus:outline-none"
              value={form[n] || ''}
              onChange={(e) => setForm({ ...form, [n]: e.target.value })}
            />
          </label>
        ))}

        {/* 1. HOME PAGE TAGLINE / SHORT INTRO */}
        <label className="md:col-span-2">
          <span className="label text-xs font-bold uppercase tracking-wider text-lime">
            🏠 Home Page Tagline / Short Intro (Shows under Hero heading on Home Page)
          </span>
          <textarea
            rows="2"
            placeholder="e.g. Full Stack Developer specializing in building modern web applications, scalable backends, and clean user interfaces."
            className="mt-1.5 w-full rounded-xl border border-lime/30 bg-white/5 p-3 text-sm leading-relaxed text-white focus:border-lime focus:outline-none"
            value={form.tagline || ''}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </label>

        {/* 2. ABOUT ME DETAILED BIO */}
        <label className="md:col-span-2">
          <span className="label text-xs uppercase tracking-wider text-zinc-400">
            📖 About Me Bio (Shows only on /about page)
          </span>
          <textarea
            rows="6"
            placeholder="Write your comprehensive background, key skills, and personal story..."
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-white focus:border-lime focus:outline-none"
            value={form.bio || ''}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </label>

        {/* 1. SIDEBAR PROFILE PHOTO */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <span className="label text-xs font-bold uppercase tracking-wider text-lime">
            1. Sidebar Profile Avatar (Small Circular Photo)
          </span>
          <div className="mt-3 flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="h-16 w-16 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-500">
                <ImageIcon size={24} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* 2. ABOUT ME PAGE PHOTO */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <span className="label text-xs font-bold uppercase tracking-wider text-lime">
            2. About Me Page Portrait Photo (Large Image)
          </span>
          <div className="mt-3 flex items-center gap-4">
            {aboutImagePreview ? (
              <img
                src={aboutImagePreview}
                alt="About Preview"
                className="h-16 w-16 rounded-xl border border-white/20 object-cover"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-500">
                <ImageIcon size={24} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20"
              onChange={handleAboutImageChange}
            />
          </div>
        </div>

        {/* Resume Upload with Direct Link */}
        <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <span className="label text-xs uppercase tracking-wider text-zinc-400">
            Resume Document (PDF)
          </span>
          <div className="mt-3 flex flex-col gap-2">
            {form.resume?.url && (
              <a
                href={getImageUrl(form.resume)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-lime hover:underline"
              >
                <FileText size={14} /> Current Resume <ExternalLink size={12} />
              </a>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="mt-1 text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>
        </div>
      </div>

      <button disabled={loading} className="btn-primary mt-6">
        {loading ? 'Saving…' : 'Save profile & About Me'}
      </button>
    </form>
  );
}
