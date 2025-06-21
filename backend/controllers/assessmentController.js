const PostAssessment = require('../models/PostAssessment');
const Trainer = require('../models/Trainer');       
const WQC = require('../models/Wqc'); // Assuming WQC model exists

exports.createPostAssessment = async (req, res) => {
  try {
    const { batchId, questions } = req.body;

    const trainer = await Trainer.findOne({ userId: req.user.id });
    if (!trainer) return res.status(403).json({ message: 'Trainer only' });

    const assessment = await PostAssessment.create({
      batchId,
      trainerId: req.user.id,
      questions
    });

    res.status(201).json({ message: 'Assessment created', assessment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create assessment', error: err.message });
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { answers } = req.body;

    const wqc = await WQC.findOne({ userId: req.user.id });
    if (!wqc) return res.status(403).json({ message: 'Only WQC can submit' });

    const assessment = await PostAssessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    // Check if already submitted
    const already = assessment.submissions.find(sub => sub.wqcId.equals(req.user.id));
    if (already) return res.status(400).json({ message: 'Already submitted' });

    assessment.submissions.push({
      wqcId: req.user.id,
      answers
    });

    await assessment.save();
    res.status(200).json({ message: 'Submission saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit assessment', error: err.message });
  }
};

exports.reviewSubmission = async (req, res) => {
  try {
    const { assessmentId, wqcId } = req.params;
    const { marksGiven } = req.body;

    const assessment = await PostAssessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    const submission = assessment.submissions.find(sub => sub.wqcId.toString() === wqcId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.marksGiven = marksGiven;
    submission.reviewed = true;

    await assessment.save();
    res.status(200).json({ message: 'Submission reviewed', submission });
  } catch (err) {
    res.status(500).json({ message: 'Review failed', error: err.message });
  }
};
