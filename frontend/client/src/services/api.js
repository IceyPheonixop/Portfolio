// client/src/services/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = BASE.replace(/\/api\/?$/, '') || 'http://localhost:5000';

// Helper to ensure external links open properly
export function formatUrl(url) {
  if (!url) return '#';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// Helper function to resolve full URL for images (local uploads or external URLs)
export function getImageUrl(img) {
  if (!img) return null;
  const url = typeof img === 'string' ? img : img.url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Helper function to provide separate View (browser preview) and Download (attachment) URLs
// Helper function to resolve the clean resume URL
export function getResumeUrls(resumeObj) {
  if (!resumeObj) return { viewUrl: null, downloadUrl: null };

  const rawUrl = getImageUrl(resumeObj);
  if (!rawUrl) return { viewUrl: null, downloadUrl: null };

  return {
    viewUrl: rawUrl,
    downloadUrl: rawUrl,
  };
}

// Programmatic download function: fetches the PDF blob and triggers a browser download
export async function downloadFile(url, filename = 'Resume.pdf') {
  if (!url) return;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch (err) {
    // Direct fallback if blob fetch is blocked
    window.open(url, '_blank');
  }
}

export async function api(path, options = {}) {
  const isForm = options.body instanceof FormData;

  // Read auth tokens
  const token = localStorage.getItem('vault_token') || localStorage.getItem('token');

  const headers = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers,
    body:
      options.body && !isForm
        ? typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body)
        : options.body,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export { BASE, API_URL };