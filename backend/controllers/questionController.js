const Question =  require('../models/Question.js');
const WQC = require('../models/Wqc.js');
const Trainer = require('../models/Trainer.js');
exports.askQuestion = async (req, res) => {
  try {
    const { courseId, questionText } = req.body;

    const wqc = await WQC.findOne({ userId: req.user.id });
    if (!wqc) return res.status(403).json({ message: 'Only WQCs can ask questions' });

    const question = await Question.create({
      courseId,
      askedBy: req.user.id,
      questionText,
      batchId: wqc.batchId
    });

    res.status(201).json({ message: 'Question posted', question });
  } catch (err) {
    res.status(500).json({ message: 'Failed to ask question', error: err.message });
  }
};


exports.getQuestionsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    let batchId = null;

    // 1. Get batchId based on role
    if (req.user.role === 'WQC') {
      const wqc = await WQC.findOne({ userId: req.user.id });
      batchId = wqc?.batchId;
    } else if (req.user.role === 'Trainer') {
      const trainer = await Trainer.findOne({ userId: req.user.id });
      // Optional: get batchId from query param if trainer has multiple batches
      batchId = req.query.batchId;
    } else if (req.user.role === 'Admin') {
      batchId = req.query.batchId;
    }

    if (!batchId) return res.status(400).json({ message: 'Batch ID required' });

    const questions = await Question.find({ courseId, batchId })
      .populate('askedBy', 'name')
      .populate('answers.answeredBy', 'name');

    res.status(200).json({ questions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions', error: err.message });
  }
};


exports.answerQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answerText } = req.body;

    const trainer = await Trainer.findOne({ userId: req.user.id });
    if (!trainer) return res.status(403).json({ message: 'Only Trainers can answer' });

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.answers.push({
      answeredBy: req.user.id,
      answerText
    });

    await question.save();
    res.status(200).json({ message: 'Answer posted', question });
  } catch (err) {
    res.status(500).json({ message: 'Failed to post answer', error: err.message });
  }
};
