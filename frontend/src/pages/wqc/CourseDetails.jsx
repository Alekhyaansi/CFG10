import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';
import './CourseDetails.css';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  const fetchData = async () => {
    try {
      const courseRes = await API.get(`/courses/${id}`);
      setCourse(courseRes.data);
      const qRes = await API.get(`/questions/${id}`);
      setQuestions(qRes.data.questions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAsk = async () => {
    if (!newQuestion.trim()) return;
    try {
      await API.post('/questions/post', { courseId: id, questionText: newQuestion });
      setNewQuestion('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting question');
    }
  };

  const handleAnswer = async (qid, answerText) => {
    try {
      await API.post(`/questions/${qid}/answer`, { answerText });
      fetchData();
    } catch (err) {
      alert('Error answering');
    }
  };

  if (!course) return <div className="loader">Loading course...</div>;

  return (
    <div className="course-details">
      <div className="course-header">
        <h1>{course.sessionNumber}. {course.title}</h1>
        <p className="course-desc">{course.description}</p>
      </div>

      {course.videoUrl && (
        <div className="video-wrapper">
          <iframe
            src={course.videoUrl}
            title="Course Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      )}

      {course.resources?.length > 0 && (
        <div className="resources">
          <h2>📎 Resources</h2>
          <ul>
            {course.resources.map((res, i) => (
              <li key={i}>
                <a href={res} target="_blank" rel="noopener noreferrer">
                  🔗 Download Resource {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="ask-box">
        <h2>❓ Ask a Question</h2>
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Type your question..."
        />
        <button onClick={handleAsk}>📤 Post Question</button>
      </div>

      <div className="qa-section">
        <h2>💬 Questions & Answers</h2>
        {questions.length === 0 ? (
          <p className="empty-msg">No questions yet. Be the first to ask!</p>
        ) : (
          questions.map((q) => (
            <div key={q._id} className="question-card">
              <p><strong>{q.askedBy.name}</strong>: {q.questionText}</p>
              <div className="answers">
                {q.answers.length > 0 ? (
                  q.answers.map((a, i) => (
                    <p key={i} className="answer">
                      💬 {a.answerText} — <em>{a.answeredBy.name}</em>
                    </p>
                  ))
                ) : (
                  <p className="no-answer">⏳ No answers yet</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
