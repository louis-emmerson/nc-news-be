const request = require("express");
const router = request.Router()
const {getAllUsers, getUserByUsername} = require("../controllers/users-controller")

router.get("/", getAllUsers)

router.get("/:username",getUserByUsername)



module.exports = router
