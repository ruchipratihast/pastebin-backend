const express = require("express");
const { validateCreatePaste, validateGetPaste } = require("../validator/validatePaste");
const { createPaste, getPaste} = require("../controllers/pasteController");

const router = express.Router();

router.post("/", validateCreatePaste, createPaste );
router.get("/:id", validateGetPaste, getPaste);

module.exports = router;
