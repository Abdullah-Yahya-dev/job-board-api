const express = require('express');
const router = express.Router();
const { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany, approveCompany } = require('../controllers/companyController');
const authMiddleware = require('../middleware/authmiddleware');
const authorize = require('../middleware/authorize');

router.post('/', authMiddleware, authorize('company'), createCompany);
router.get('/',  getAllCompanies);
router.get('/:id',  getCompanyById);
router.put('/:id', authMiddleware, authorize('company'), updateCompany);
router.delete('/:id', authMiddleware, authorize('admin', 'company'), deleteCompany);
router.patch('/:id/approve', authMiddleware, authorize('admin'), approveCompany);

module.exports = router;