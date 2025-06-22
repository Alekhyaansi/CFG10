const Trainer = require('../models/Trainer');
const WQC = require('../models/Wqc');
const PostAssessment = require('../models/PostAssessment');

exports.getTrainerDashboard = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user.id });
    if (!trainer) return res.status(403).json({ message: 'Not a trainer' });

    if (!trainer.batchesHandled || trainer.batchesHandled.length === 0) {
      return res.status(200).json({
        batches: [],
        totalWQCs: 0,
        assessmentsCreated: 0,
        pendingReviews: 0
      });
    }

    const wqcs = await WQC.find({ batchId: { $in: trainer.batchesHandled } })
      .populate('userId', 'name');

    const batchMap = {};
    wqcs.forEach(w => {
      if (!batchMap[w.batchId]) batchMap[w.batchId] = [];
      batchMap[w.batchId].push({
        name: w.userId?.name || 'Unknown',
        sessionProgress: w.sessionProgress,
        _id: w.userId?._id
      });
    });

    const assessmentCount = await PostAssessment.countDocuments({ trainerId: req.user.id });

    const pending = await PostAssessment.aggregate([
      { $match: { trainerId: req.user.id } },
      { $unwind: "$submissions" },
      { $match: { "submissions.reviewed": false } },
      { $count: "count" }
    ]);

    res.status(200).json({
      batches: Object.keys(batchMap).map(id => ({
        batchId: id,
        students: batchMap[id]
      })),
      totalWQCs: wqcs.length,
      assessmentsCreated: assessmentCount,
      pendingReviews: pending[0]?.count || 0
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};
