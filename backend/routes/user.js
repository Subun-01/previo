const express = require('express');
const router = express.Router();
const { getUserFromToken } = require('../middlewire/verifyUser');
const userController = require('../controllers/userController');

// Route to save user preferences
router.post('/preferences', getUserFromToken, userController.savePreferences);
/*
          AGENT-1 Roadmap AGENT
*/
// Route to generate a personalized study roadmap
router.post('/generate-roadmap', getUserFromToken, userController.generateRoadmap);
/*
          AGENT-2 Question generating AGENT
*/
// POST /api/agent2/generate-questions
router.post('/generate-questions', getUserFromToken, userController.generateQuestions);

/*
          AGENT-3 Feedback AGENT
*/
// POST /api/agent2/submit-answer
router.post('/submit-answer', getUserFromToken, userController.submitAnswer);

router.get('/get-preferences', getUserFromToken, userController.getPreferences);


module.exports = router;