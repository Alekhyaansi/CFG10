# CFG10

POST api/admin/courses -- to create course(admin);

GET api/admin/courses -- to view all the courses(admin);

PUT api/admin/courses/:id -- to update the course(admin);

DELETE api/admin/courses/:d -- delete course(admin);

POST api/questions/post -- to ask the question under the course (WQC);

GET  api/questions/:courseId -- to get Questions for course (WQC, Trainer, Admin);

POST api/questions/:questionId/answer -- to answer question (Trainer)

POST api/auth/register -- to register;

POST api/auth/login -- to login

POST api/assessment/post -- to create post-assessment(Trainer);

POST api/assessment/:assessmentId/submit -- to submit assessment(WQC);

POST api/assessment/:assessmentId/review/:wqcId - trainer reviewing the submission(Trainer)

GET api/wqc/all-courses -- get all courses (wqc);

GET api/wqc/dashboard -- getMyDashboard(wqc);

PATCH api/wqc/complete/:courseId -- completeCourse(wqc);

GET api/wqc/resources -- get unlocked courses (wqc);
