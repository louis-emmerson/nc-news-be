const express = require("express")
const { getComment, deleteComment, updateComment } = require("./controllers/comments-controller")
const router = express.Router()


router.get("/:comment_id", getComment)

router.delete("/:comment_id", deleteComment)

router.patch("/:comment_id", updateComment)


module.exports = router