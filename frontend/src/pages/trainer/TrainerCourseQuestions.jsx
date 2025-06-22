// 📁 src/pages/TrainerCourseQuestions.jsx
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import API from '../../api'; // Adjust if needed

export default function TrainerCourseQuestions() {
  const { id } = useParams(); // courseId
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get('batchId');

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
  try {
    setLoading(true); // ✅ moved here
    const res = await API.get(`/question/${id}/unanswered`, {
      params: { batchId }
    });
    setQuestions(res.data.questions);
  } catch (err) {
    alert('Failed to load questions');
  } finally {
    setLoading(false); // ✅ also end loading
  }
};

  useEffect(() => {
    if (batchId) fetchQuestions();
  }, [id, batchId]);

  const handleAnswer = async (qid) => {
    try {
      await API.post(`/question/${qid}/answer`, { answerText: answers[qid] });
      setAnswers(prev => ({ ...prev, [qid]: '' }));
      fetchQuestions(); // Refresh to show answer
    } catch (err) {
      alert('Error posting answer');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Trainer Answer Portal</h1>

      {!batchId ? (
        <p className="text-red-600">❗ Batch ID is missing in the URL.</p>
      ) : loading ? (
        <p>Loading questions...</p>
      ) : questions.length === 0 ? (
        <p>No questions asked yet for this course and batch.</p>
      ) : (
        questions.map((q) => (
          <div key={q._id} className="border p-4 rounded space-y-2">
            <p><strong>{q.askedBy?.name || 'Anonymous'}:</strong> {q.questionText}</p>

            {q.answers.length > 0 ? (
              <div className="pl-4 space-y-1 text-green-700">
                {q.answers.map((a, i) => (
                  <p key={i}>💬 {a.answerText} — <em>{a.answeredBy?.name || 'Trainer'}</em></p>
                ))}
              </div>
            ) : (
              <div className="mt-2">
                <textarea
                  value={answers[q._id] || ''}
                  onChange={(e) =>
                    setAnswers(prev => ({ ...prev, [q._id]: e.target.value }))
                  }
                  placeholder="Write your answer here..."
                  className="w-full border rounded p-2"
                  rows={2}
                />
                <button
                  onClick={() => handleAnswer(q._id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Submit Answer
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
