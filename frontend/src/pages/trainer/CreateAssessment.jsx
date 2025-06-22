import { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import './CreateAssessment.css'; // Optional: for extra styles

export default function CreateAssessment() {
  const [batchId, setBatchId] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      type: 'MCQ',
      options: ['', '', '', ''],
      correctAnswer: ''
    }
  ]);

  const navigate = useNavigate();

  const handleQuestionChange = (index, field, value) => {
    const copy = [...questions];
    copy[index][field] = value;
    setQuestions(copy);
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    const copy = [...questions];
    copy[qIdx].options[optIdx] = value;
    setQuestions(copy);
  };

  const handleSubmit = async () => {
    try {
      await API.post('/assessment/post', { batchId, questions });
      alert('✅ Assessment created successfully!');
      navigate('/assessment/trainer');
    } catch (err) {
      alert('❌ Failed to create assessment. Try again!');
    }
  };

  return (
    <div className="create-assessment-container pop-section">
      <h1 className="text-3xl font-bold mb-4">📝 Create Post-Assessment</h1>

      <input
        type="text"
        placeholder="🔍 Enter Batch ID"
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        className="input-field"
      />

      {questions.map((q, qIdx) => (
        <div key={qIdx} className="question-card pop-card">
          <h2 className="font-semibold text-lg">❓ Question {qIdx + 1}</h2>

          <textarea
            rows="2"
            value={q.questionText}
            onChange={(e) =>
              handleQuestionChange(qIdx, 'questionText', e.target.value)
            }
            className="input-field"
            placeholder="Type your question clearly..."
          />

          <div className="space-y-1">
            <p className="font-medium mt-2">🧠 Options:</p>
            {q.options.map((opt, optIdx) => (
              <input
                key={optIdx}
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                className="input-field"
                placeholder={`Option ${optIdx + 1}`}
              />
            ))}
          </div>

          <input
            type="text"
            value={q.correctAnswer}
            onChange={(e) =>
              handleQuestionChange(qIdx, 'correctAnswer', e.target.value)
            }
            className="input-field"
            placeholder="✅ Correct Answer (must match one of the options)"
          />
        </div>
      ))}

      <button
        onClick={() =>
          setQuestions([
            ...questions,
            {
              questionText: '',
              type: 'MCQ',
              options: ['', '', '', ''],
              correctAnswer: ''
            }
          ])
        }
        className="btn-link mt-3"
      >
        ➕ Add Another Question
      </button>

      <button
        onClick={handleSubmit}
        className="btn pop mt-5"
      >
        ✅ Create Assessment
      </button>
    </div>
  );
}
