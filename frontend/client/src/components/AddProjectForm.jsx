// client/src/components/AddProjectForm.jsx
import React, { useState } from 'react';

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    liveLink: '',
  });

  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    const token = localStorage.getItem('token'); // Retrieve stored JWT

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStatus({ loading: false, error: null, success: true });
      setFormData({
        title: '',
        description: '',
        technologies: '',
        githubLink: '',
        liveLink: '',
      });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add New Project</h2>

      {status.error && <p style={{ color: 'red' }}>{status.error}</p>}
      {status.success && <p style={{ color: 'green' }}>Project added successfully!</p>}

      <div>
        <label>Project Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Technologies (comma separated)</label>
        <input
          type="text"
          name="technologies"
          placeholder="React, Node.js, MongoDB"
          value={formData.technologies}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>GitHub Link</label>
        <input
          type="url"
          name="githubLink"
          value={formData.githubLink}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Live Demo URL</label>
        <input
          type="url"
          name="liveLink"
          value={formData.liveLink}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={status.loading}>
        {status.loading ? 'Saving...' : 'Add Project'}
      </button>
    </form>
  );
};

export default AddProjectForm;