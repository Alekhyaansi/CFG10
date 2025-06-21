const Course = require('../models/Course');
const Trainer = require('../models/Trainer');
const PostAssessment = require('../models/PostAssessment');
const WQC = require('../models/Wqc');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort('sessionNumber');
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};



exports.getMyDashboard = async (req, res) => {
  try {
    // 1. Find WQC data
    const wqc = await WQC.findOne({ userId: req.user.id });
    if (!wqc) return res.status(404).json({ message: 'WQC not found' });

    // 2. Get trainer for batch
    const trainer = await Trainer.findOne({ batchId: wqc.batchId }).populate('userId', 'name email');

    // 3. Get all courses
    const allCourses = await Course.find().sort('sessionNumber');

    // 4. Calculate completed courses
    const completedSessions = wqc.sessionProgress;

    // 5. Get post-assessment marks
    const assessment = await PostAssessment.findOne({ batchId: wqc.batchId });
    let mySubmission = null;
    if (assessment) {
      mySubmission = assessment.submissions.find(sub => sub.wqcId.toString() === req.user.id);
    }

    res.status(200).json({
      name: req.user.name,
      batchId: wqc.batchId,
      trainer: trainer ? {
        name: trainer.userId.name,
        email: trainer.userId.email
      } : null,
      sessionProgress: completedSessions,
      totalCourses: allCourses.length,
      allCourses,
      completedCourses: allCourses.filter(c => c.sessionNumber <= completedSessions),
      postAssessment: mySubmission ? {
        reviewed: mySubmission.reviewed,
        marksGiven: mySubmission.marksGiven
      } : null
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};

exports.completeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const wqc = await WQC.findOne({ userId });
    if (!wqc) return res.status(404).json({ message: 'WQC not found' });

    // Already completed?
    if (wqc.completedSessions.some(c => c.courseId.equals(courseId))) {
      return res.status(200).json({ message: 'Already completed' });
    }

    // Only allow sequential progression
    if (wqc.sessionProgress + 1 !== course.sessionNumber) {
      return res.status(400).json({ message: 'Please complete previous sessions first' });
    }

    // 1. Update session progress
    wqc.sessionProgress++;

    // 2. Push completed session with timestamp
    wqc.completedSessions.push({ courseId });

    // 3. Check if this is a resource unlock milestone
    const milestones = [3, 6, 9];
    if (milestones.includes(wqc.sessionProgress) && !wqc.resourcesUnlocked.includes(wqc.sessionProgress)) {
      wqc.resourcesUnlocked.push(wqc.sessionProgress);
    }

    await wqc.save();

    res.status(200).json({
      message: 'Course marked as completed',
      progress: wqc.sessionProgress,
      resourcesUnlocked: wqc.resourcesUnlocked
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to update progress', error: err.message });
  }
};

exports.getUnlockedResources = async (req, res) => {
  try {
    const wqc = await WQC.findOne({ userId: req.user.id });
    if (!wqc) return res.status(404).json({ message: 'WQC not found' });

    // Get all courses up to sessionProgress (just an example)
    const allResources = await Course.find({
      sessionNumber: { $in: wqc.resourcesUnlocked }
    }).select('resources sessionNumber');

    res.status(200).json({ resources: allResources });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch resources', error: err.message });
  }
};


