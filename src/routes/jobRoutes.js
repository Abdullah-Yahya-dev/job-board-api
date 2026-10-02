const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJobById, updateJob, deleteJob, approveJob, getMyJobs } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authmiddleware');
const authorize = require('../middleware/authorize');
const { jobCreateSchema, jobUpdateSchema, jobApproveByAdminSchema} = require('../validators/job.validator');
const  validate  = require('../middleware/validate');


router.post('/', authMiddleware, authorize('company'), validate(jobCreateSchema), createJob);
router.get('/', getAllJobs);
router.get('/my-jobs', authMiddleware, authorize('company'), getMyJobs);
router.get('/:id', getJobById);
router.put('/:id', authMiddleware, authorize('company'), validate(jobUpdateSchema), updateJob);
router.delete('/:id', authMiddleware, authorize('company', 'admin'), deleteJob);
router.patch('/:id/approve', authMiddleware, authorize('admin'), validate(jobApproveByAdminSchema), approveJob);

module.exports = router;