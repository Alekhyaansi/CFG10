import React, { useEffect, useState } from 'react';
import API from '../../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    sessionNumber: '',
    title: '',
    description: '',
    videoUrl: '',
    resources: [],
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/courses');
      if (Array.isArray(res.data.courses)) {
        setCourses(res.data.courses);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'admin_courses');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dbiuwhbnt/auto/upload', {
        method: 'POST',
        body: data,
      });
      const cloud = await res.json();
      setForm((prev) => ({ ...prev, videoUrl: cloud.secure_url }));
    } catch (err) {
      console.error('Video upload failed:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    const uploaded = [];

    for (const file of files) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'admin_courses');

      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dbiuwhbnt/auto/upload', {
          method: 'POST',
          body: data,
        });
        const cloud = await res.json();
        uploaded.push({ url: cloud.secure_url, name: file.name });
      } catch (err) {
        console.error('File upload failed:', err);
      }
    }

    setForm((prev) => ({
      ...prev,
      resources: [...prev.resources, ...uploaded],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/courses', form);
      setForm({ sessionNumber: '', title: '', description: '', videoUrl: '', resources: [] });
      fetchCourses();
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Failed to create course');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete course');
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">📚 Add New Course</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input name="sessionNumber" value={form.sessionNumber} onChange={handleInputChange} placeholder="Session Number" required />
        <input name="title" value={form.title} onChange={handleInputChange} placeholder="Title" required />
        <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Description" rows={3} />

        <div className="form-section">
          <label>🎥 Upload Course Video</label>
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
          {form.videoUrl && <video src={form.videoUrl} controls className="preview-video" />}
        </div>

        <div className="form-section">
          <label>📎 Upload Resources</label>
          <input type="file" multiple onChange={handleFileUpload} />
          <ul>
            {form.resources.map((res, i) => (
              <li key={i}>
                <a href={res.url} target="_blank" rel="noopener noreferrer">{res.name || `File ${i + 1}`}</a>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="submit-btn">✅ Create Course</button>
      </form>

      <h2 className="admin-heading">📂 Existing Courses</h2>

      {loading ? (
        <p className="loading">⏳ Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : courses.length === 0 ? (
        <p className="empty">No courses available.</p>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="card-header">
                <h3>{course.sessionNumber}. {course.title}</h3>
                <button onClick={() => handleDelete(course._id)} className="delete-btn">🗑 Delete</button>
              </div>
              <p>{course.description}</p>
              {course.videoUrl && <video src={course.videoUrl} controls className="preview-video" />}
              <div className="resources">
                <p><strong>Resources:</strong></p>
                <ul>
                  {course.resources?.map((r, idx) => (
                    <li key={idx}>
                      <a href={r.url || r} target="_blank" rel="noopener noreferrer">
                        {r.name || `Resource ${idx + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
