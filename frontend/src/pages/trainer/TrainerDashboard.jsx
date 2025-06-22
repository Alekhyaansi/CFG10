import { useEffect, useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import './TrainerDashboard.css'; // Optional: for custom themed styles

export default function TrainerDashboard() {
  const [trainerInfo, setTrainerInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const res = await API.get('/trainer/dashboard');
        setTrainerInfo(res.data);
      } catch (err) {
        alert('⚠️ Failed to load trainer dashboard');
      }
    };

    fetchTrainerData();
  }, []);

  if (!trainerInfo) return <p>⏳ Loading your dashboard...</p>;

  const firstBatch = trainerInfo.batches?.[0];
  const courseId = firstBatch?.courseId || '';
  const batchId = firstBatch?.batchId || '';

  return (
    <div className="trainer-dashboard-container pop-section">
      <h1 className="dashboard-title">🎓 Trainer Dashboard</h1>

      <section className="overview-card pop-card">
        <h2 className="section-heading">📊 Quick Overview</h2>
        <p><strong>Batches Handled:</strong> {trainerInfo.batches.length}</p>
        <p><strong>Total Students:</strong> {trainerInfo.totalWQCs}</p>
        <p><strong>Assessments Created:</strong> {trainerInfo.assessmentsCreated}</p>
        <p><strong>Pending Reviews:</strong> {trainerInfo.pendingReviews}</p>

        <div className="dashboard-buttons">
          <button
            onClick={() => navigate('/trainer/create-assessment')}
            className="btn pop"
          >
            ➕ Create Assessment
          </button>

          <button
            onClick={() => navigate('/trainer/assessments')}
            className="btn-outline"
          >
            📄 View Assessments
          </button>

          {courseId && batchId && (
            <button
              onClick={() =>
                navigate(`/trainer/course/questions?id=${courseId}&batchId=${batchId}`)
              }
              className="btn-link"
            >
              ❓ View Unanswered Questions
            </button>
          )}
        </div>
      </section>

      <section className="batch-section">
        <h2 className="section-heading">👥 Your Batches</h2>
        {trainerInfo.batches.length === 0 ? (
          <p> No batches assigned yet. Hang tight!</p>
        ) : (
          trainerInfo.batches.map((batch, i) => (
            <div key={batch.batchId || i} className="batch-card pop-card">
              <h3 className="batch-title">📦 Batch: {batch.batchId}</h3>
              <p><strong>👩‍🏫 Students:</strong> {batch.students.length}</p>
              <ul className="student-list">
                {batch.students.map(stu => (
                  <li key={stu._id}>
                    {stu.name} — ✅ {stu.sessionProgress} session
                    {stu.sessionProgress !== 1 ? 's' : ''} completed
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
