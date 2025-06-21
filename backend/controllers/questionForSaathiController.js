const Question = require('../models/QuestionForSaathi');

const Saathi = require('../models/Saathi');


exports.postQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create({
      questionText: req.body.questionText,
      askedBy: req.user._id,
    });
    res.status(201).json({ message: "Question posted", question: newQuestion });
  } catch (err) {
    res.status(500).json({ message: "Failed to post question", error: err.message });
  }
};



exports.answerQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answerText } = req.body;

    const question = await Question.findById(questionId).populate('askedBy');

    const saathi = await Saathi.findOne({ userId: req.user._id });

    if (!saathi.mentees.includes(question.askedBy._id)) {
      return res.status(403).json({ message: "You can only answer your mentee's questions" });
    }

    question.answerText = answerText;
    question.answeredBy = req.user._id;
    question.isAnswered = true;

    await question.save();

    res.status(200).json({ message: "Answer submitted", question });
  } catch (err) {
    res.status(500).json({ message: "Failed to answer question", error: err.message });
  }
};
