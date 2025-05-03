import Feedback from "../models/feedback.js";
import User from "../models/user.js";

// Add feedback with UserId
export const addFeedback = async (req, res) => {
  const { userId, note, remarks } = req.body;
  const filePath = req.file ? req.file.path : null;

  try {
    const user = await User.findByPk(userId); // Ensure the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newFeedback = await Feedback.create({
      UserId: userId,
      note,
      remarks,
      filePath,
    });
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all feedback with associated User data
export const getAllFeedback = async (req, res) => {
    try {
      const feedback = await Feedback.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name"], // Include only necessary fields
          },
        ],
      });
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  