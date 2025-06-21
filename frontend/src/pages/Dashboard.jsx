import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    question:
      "What is the permissible limit of fluoride in drinking water (BIS standard)?",
    options: ["1.0 mg/L", "1.5 mg/L", "2.0 mg/L", "0.5 mg/L"],
    correct: 1,
  },
  {
    question: "What is the major cause of fluorosis?",
    options: [
      "Arsenic in food",
      "Excess fluoride in water",
      "Lead pipes",
      "Salty water",
    ],
    correct: 1,
  },
  {
    question: "Which mission focuses on safe drinking water in rural India?",
    options: ["Swachh Bharat", "Jal Jeevan Mission", "Namami Gange", "AMRUT"],
    correct: 1,
  },
];

const Dashboard = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const navigate = useNavigate();

  const handleOptionChange = (qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);
    localStorage.setItem("preTestDone", "true"); // Save that test is done
  };

  const handleGoToCourses = () => {
    navigate("/courses");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>🎉 Welcome to Your Dashboard</h2>
      <h3>🧪 Pre-Assessment</h3>

      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <p>
            <strong>
              {i + 1}. {q.question}
            </strong>
          </p>
          {q.options.map((opt, j) => (
            <label key={j} style={{ display: "block", marginLeft: "1rem" }}>
              <input
                type="radio"
                name={`q${i}`}
                checked={answers[i] === j}
                onChange={() => handleOptionChange(i, j)}
                disabled={submitted}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "1rem",
          }}
        >
          Submit Test
        </button>
      ) : (
        <div>
          <h4 style={{ marginTop: "1rem" }}>
            ✅ You scored {score} / {questions.length}
          </h4>
          {questions.map((q, i) => (
            <div key={i}>
              <p>
                <strong>Q{i + 1}:</strong> {q.question}
                <br />
                <span
                  style={{
                    color: answers[i] === q.correct ? "green" : "red",
                  }}
                >
                  Your answer: {q.options[answers[i]] || "Not answered"}
                </span>
                <br />
                Correct answer: {q.options[q.correct]}
              </p>
            </div>
          ))}

          <button
            onClick={handleGoToCourses}
            style={{
              marginTop: "1.5rem",
              padding: "10px 25px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            🚀 Go to Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
