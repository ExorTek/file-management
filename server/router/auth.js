const {login, sendLoggedInUser, changePassword} = require("../controller/admin");
const {getAccessToRoute} = require("../middleware/auth");
const router = require('express').Router();

router.post('/login', login)
router.use(getAccessToRoute);
router.put('/changePassword', changePassword)
router.get('/me', sendLoggedInUser)


module.exports = router;
