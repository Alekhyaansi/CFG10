import React, { useEffect, useState } from 'react';
import API from '../../api';

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 👇 Upload only 1 video
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'admin_courses'); // replace with your preset

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
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          name="sessionNumber"
          value={form.sessionNumber}
          onChange={handleInputChange}
          placeholder="Session Number"
          className="border p-2 w-full"
          required
        />
        <input
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="border p-2 w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border p-2 w-full"
        />

        {/* 🔴 Upload Video */}
        <div>
          <label className="block mb-1 font-medium">Upload Video (Cloudinary)</label>
          <input type="file" accept="video/*" onChange={handleVideoUpload} className="border p-2 w-full" />
          {form.videoUrl && (
            <video src={form.videoUrl} controls width="100%" className="mt-2 rounded" />
          )}
        </div>

        {/* 🔵 Upload Other Resources */}
        <div>
          <label className="block mb-1 font-medium">Upload Additional Resources (PDFs, etc.)</label>
          <input type="file" multiple onChange={handleFileUpload} className="border p-2 w-full" />
          {form.resources.length > 0 && (
            <ul className="mt-2 text-sm list-disc pl-5">
              {form.resources.map((r, i) => (
                <li key={i}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.name || `File ${i + 1}`}</a></li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>

      <h2 className="text-xl font-bold mb-2">Existing Courses</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course._id} className="border p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{course.sessionNumber}. {course.title}</p>
                  <p>{course.description}</p>
                  {course.videoUrl && (
                    <video src={course.videoUrl} controls className="mt-2 rounded" width="100%" />
                  )}
                  <p className="mt-2 font-medium">Resources:</p>
                  <ul className="list-disc ml-6 text-sm">
                    {course.resources?.map((res, idx) => (
                      <li key={idx}>
                        <a href={res.url || res} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          {res.name || `Resource ${idx + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="bg-red-500 text-white px-2 py-1 h-fit rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
