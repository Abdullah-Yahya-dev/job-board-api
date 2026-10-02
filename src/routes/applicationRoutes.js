const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications, getJobApplications, updateApplicationStatus} = require ('../controllers/applicationController');
const authMiddleware = require('../middleware/authmiddleware');
const {uploadCV} = require('../config/multer');
const authorize = require('../middleware/authorize');
const {applicationStatusSchema} = require('../validators/application.validator');
const  validate  = require('../middleware/validate');



router.post('/:jobId/apply', authMiddleware, authorize('jobseeker'), uploadCV.single('cv'), applyToJob);
router.get('/my-applications', authMiddleware,  getMyApplications);
router.get('/:jobId/applications', authMiddleware, authorize('company'), getJobApplications);
router.patch('/:id/status', authMiddleware, authorize('company'), validate(applicationStatusSchema), updateApplicationStatus);

module.exports = router;