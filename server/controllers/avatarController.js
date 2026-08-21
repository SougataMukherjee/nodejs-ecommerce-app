const avatarService = require("../services/avatarService");

exports.getAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const avatar = await avatarService.getAvatarByUserId(userId);
    res.json(avatar || { image: null });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch avatar", error: error.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const existing = await avatarService.getAvatarByUserId(userId);

    if (existing) {
      const updated = await avatarService.updateAvatar(existing.id, { image });
      return res.json(updated);
    }

    const created = await avatarService.createAvatar({ userId, image });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to update avatar", error: error.message });
  }
};
