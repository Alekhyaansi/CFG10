const Saathi = require('../models/Saathi');

exports.chooseSaathi = async (req, res) => {
  try {
    const saathiId = req.params.saathiId;
    const wqcUserId = req.user._id;

    const saathi = await Saathi.findById(saathiId);

    if (!saathi) {
      return res.status(404).json({ message: 'Saathi not found' });
    }

    if (saathi.currentMentees >= saathi.maxMentees) {
      return res.status(400).json({ message: 'Saathi has reached the maximum number of mentees' });
    }

    if (saathi.mentees.includes(wqcUserId)) {
      return res.status(400).json({ message: 'You have already selected this Saathi' });
    }

    saathi.mentees.push(wqcUserId);
    saathi.currentMentees += 1;

    await saathi.save();

    res.status(200).json({ message: 'Saathi assigned successfully', saathi });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
