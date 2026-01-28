
module.exports.validateCreatePaste = (req, res, next) => {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
        return res.status(400).json({ error: "content is required" });
    }

    if (
        ttl_seconds !== undefined &&
        (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
        return res.status(400).json({ error: "Invalid ttl_seconds" });
    }

    if (
        max_views !== undefined &&
        (!Number.isInteger(max_views) || max_views < 1)
    ) {
        return res.status(400).json({ error: "Invalid max_views" });
    }

    next(); 
};

module.exports.validateGetPaste = (req, res, next) => {
    const  id  = req.params.id;

    if (!id) {
        return res.status(404).json({ error: "Paste unavailable" });
    }

    next();
};
