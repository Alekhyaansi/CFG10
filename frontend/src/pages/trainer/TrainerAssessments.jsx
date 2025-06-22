import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import './TrainerAssessment.css'; // Optional for custom styles

export default function TrainerAssessments() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/assessment/trainer/assessments');
        setAssessments(res.data.assessments);
      } catch (err) {
        alert('❌ Failed to load assessments');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="trainer-assessments-container pop-section">
      <h1 className="text-2xl font-bold mb-6">📋 My Assessments</h1>

      {assessments.length === 0 ? (
        <p>😕 No assessments found. Let's get started by creating one! 🚀</p>
      ) : (
        assessments.map((a, i) => (
          <div key={i} className="assessment-card pop-card">
            <p><strong>📦 Batch:</strong> {a.batchId}</p>

            <Link
              to={`/assessment/trainer/assessments/${a._id}`}
              className="btn-link mt-2 inline-block"
            >
              📝 View Full Assessment
            </Link>

            <p className="mt-3 font-medium">🧠 Questions Included:</p>
            <ul className="list-disc ml-6 space-y-1">
              {a.questions.map((q, j) => (
                <li key={j}>{q.questionText}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
