const express = require('express');
const router = express.Router();
const userConfigController = require('../controllers/userConfigController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/:usuario_id', authenticateToken, userConfigController.getConfig);
router.put('/:usuario_id', authenticateToken, userConfigController.updateConfig);

module.exports = router;