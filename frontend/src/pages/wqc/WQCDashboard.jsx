import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import './WQCDashboard.css';

export default function WQCDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/wqc/dashboard');
        setDashboard({
          ...res.data,
          resourcesUnlocked: res.data.resourcesUnlocked || []
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const completeCourse = async (courseId) => {
    try {
      await API.patch(`/wqc/complete/${courseId}`);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete');
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!dashboard) return <div className="error">Dashboard unavailable</div>;

  const { sessionProgress, totalCourses } = dashboard;
  const progressPercent = Math.round((sessionProgress / totalCourses) * 100);

  return (
    <div className="wqc-dashboard">
      <div className="header">
        <h1>👋 Hello, {dashboard.name}</h1>
        <p>Batch <strong>{dashboard.batchId}</strong></p>
        {dashboard.trainer && <p>Trainer: {dashboard.trainer.name}</p>}
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <p>{sessionProgress} of {totalCourses} done</p>
          <p><strong>{progressPercent}% Complete</strong></p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="courses-grid">
        {dashboard.allCourses.map(c => {
          const isNext = sessionProgress + 1 === c.sessionNumber;
          const done = dashboard.completedCourses.some(x => x._id === c._id);
          const unlocked = dashboard.resourcesUnlocked.includes(c.sessionNumber);

          return (
            <div key={c._id} className={`course-card ${done ? 'done' : ''}`}>
              <Link to={`/wqc/course-detail/${c._id}`} className="card-content">
                <h3>{c.sessionNumber}. {c.title}</h3>
                <p>{c.description}</p>
              </Link>

              {c.videoUrl && (
                <video src={c.videoUrl} controls className="course-video" />
              )}

              <div className="card-actions">
                {isNext && !done && (
                  <button className="complete-btn" onClick={() => completeCourse(c._id)}>
                    ✅ Mark Done
                  </button>
                )}
                {done && <span className="badge done">✔ Completed</span>}
              </div>

              {unlocked && c.resources?.length > 0 && (
                <div className="resources">
                  <p>🔓 Resources:</p>
                  <ul>
                    {c.resources.map((url, i) => (
                      <li key={i}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          📄 Resource {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="assessment-section">
        <h2>📝 Post-Assessment</h2>
        {dashboard.postAssessment ? (
          <div className="assessment-box">
            <p>Reviewed: {dashboard.postAssessment.reviewed ? '✅' : '❌'}</p>
            <p>Marks: <strong>{dashboard.postAssessment.marksGiven}</strong></p>
          </div>
        ) : (
          <p>No submission yet 🚫</p>
        )}
      </div>
    </div>
  );
}
