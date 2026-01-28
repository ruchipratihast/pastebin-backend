const Paste = require("../models/paste");
const { getNow } = require("../utils/now");

exports.createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    const expiresAt =
      ttl_seconds !== undefined
        ? new Date(Date.now() + ttl_seconds * 1000)
        : null;

    const paste = await Paste.create({
      content,
      expiresAt,
      maxViews: max_views ?? null,
    });

    res.status(201).json({
      id: paste._id.toString(),
      url: `${process.env.DEV_URL}/pastes/${paste._id}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPaste = async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);

    const now = getNow(req);

    if (paste.expiresAt && now >= paste.expiresAt) {
      return res.status(404).json({ error: "Paste expired" });
    }

    // View limit check
    if (paste.maxViews !== null && paste.views >= paste.maxViews) {
      return res.status(404).json({ error: "Paste max view limit crossed" });
    }

    // Atomic increment (safe under concurrency)
    paste.views += 1;
    await paste.save();

    const remainingViews =
      paste.maxViews === null
        ? null
        : Math.max(paste.maxViews - paste.views, 0);

    res.json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid paste ID" });
  }
};
