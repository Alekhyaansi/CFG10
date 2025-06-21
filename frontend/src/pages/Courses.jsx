import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseQuiz from "../pages/CourseQuiz";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState(0);
  const [userId, setUserId] = useState(null);

  // Fetch courses + user progress on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) return;

      setUserId(user._id);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/wqc/${user._id}`
        );
        setUserProgress(res.data.sessionProgress || 0);
      } catch (err) {
        console.error("Failed to fetch user progress:", err.message);
      }

      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err.message);
      }
    };

    fetchInitialData();
  }, []);

  const completeSession = async (sessionNumber) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/wqc/${userId}/complete-session`,
        { sessionNumber }
      );
      alert(`✅ Session ${sessionNumber} marked as complete!`);
      setUserProgress(sessionNumber);
    } catch (err) {
      console.error("Failed to update session progress:", err.message);
      alert("⚠️ Could not update session. Try again.");
    }
  };

  return (
    <div className="courses-container" style={{ padding: "2rem" }}>
      <h2>📘 Water Quality Management Course Sessions</h2>

      {courses.map((course) => (
        <div
          key={course._id}
          className={`course-card ${
            userProgress + 1 >= course.sessionNumber ? "unlocked" : "locked"
          }`}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1.5rem",
            borderRadius: "8px",
            backgroundColor:
              userProgress + 1 >= course.sessionNumber ? "#f9fff9" : "#f0f0f0",
          }}
        >
          <h3>
            Session {course.sessionNumber}: {course.title}
          </h3>

          {userProgress + 1 >= course.sessionNumber ? (
            <>
              <p>{course.description}</p>

              {course.videoUrl && (
                <div className="video-wrapper" style={{ margin: "1rem 0" }}>
                  <iframe
                    width="100%"
                    height="315"
                    src={course.videoUrl}
                    title={course.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* 🔐 Only show quiz for the current session */}
              {userProgress + 1 === course.sessionNumber && (
                <CourseQuiz
                  sessionNumber={course.sessionNumber}
                  onComplete={() => completeSession(course.sessionNumber)}
                />
              )}

              {/* Only show resources if 5 or more sessions are completed */}
              {userProgress >= 5 && course.resources?.length > 0 && (
                <ul style={{ marginTop: "1rem" }}>
                  {course.resources.map((res, i) => (
                    <li key={i}>
                      <a href={res} target="_blank" rel="noopener noreferrer">
                        📄 Resource {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {/* ✅ Manual completion button if not using quiz */}
              {/* (Optional if you want both quiz and button, else quiz can trigger completion) */}
              {userProgress + 1 === course.sessionNumber && (
                <button
                  onClick={() => completeSession(course.sessionNumber)}
                  style={{
                    marginTop: "1rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                  }}
                >
                  ✅ Mark Session {course.sessionNumber} as Complete
                </button>
              )}
            </>
          ) : (
            <p style={{ color: "gray" }}>
              🔒 This session will unlock after completing Session{" "}
              {course.sessionNumber - 1}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Courses;
