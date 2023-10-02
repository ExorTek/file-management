const {
    getFolders,
    createFolder,
    getFoldersByCreator,
    updateFolder,
    deleteFolder,
    getFoldersByAccess
} = require("../controller/folder");
const {getSuperAdminAccess, getAccessToRoute, getAdminAccess} = require("../middleware/auth");
const router = require('express').Router();


router.use(getAccessToRoute);
router.get('/creator/:id', getFoldersByCreator);
router.get('/accessedFolders', getFoldersByAccess);
router.use(getAdminAccess)
router.get('/', getFolders);
router.use(getSuperAdminAccess);
router.post('/', createFolder);
router.put('/:id', updateFolder);
router.delete('/:id', deleteFolder);


module.exports = router;
