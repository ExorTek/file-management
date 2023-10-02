const router = require('express').Router();
const {
    register,
    createUser,
    updateUser,
    getUsers,
    getUserById, getUserDoesntAccessFolders,
} = require('../controller/admin');
const {getAccessToRoute, getSuperAdminAccess} = require("../middleware/auth");



router.use([getAccessToRoute, getSuperAdminAccess]);
router.post('/user', createUser)
router.get('/users', getUsers)
router.get  ('/userAccessFolders/:id', getUserDoesntAccessFolders)
router.get('/user/:id', getUserById)
router.post('/register', register)
router.put('/user', updateUser)

module.exports = router;
