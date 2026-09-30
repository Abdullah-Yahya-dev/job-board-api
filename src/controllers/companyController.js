const Company = require('../models/Company');
const User = require('../models/User');


const createCompany = async (req, res, next) => {
    try {
        const companyData = req.body;
        const userId = req.user.id;
        const existing = await Company.findOne({ user: userId });
        if (existing) return res.status(400).json({ error: 'You already have a company profile' });
        const company = await Company.create({ ...companyData, user: userId });
        res.status(201).json({
            success: true,
            data: company,
            message: 'Company created successfully'
        });
    } catch (error) {
        next(error);
    }
};

const getCompanyById = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id).populate('user', 'name email');
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.status(200).json({
            success: true,
            data: company
        });
    } catch (error) {
        next(error);
    }
};

const getAllCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find({isApproved: true}).populate('user', 'name email');
        res.status(200).json({
            success: true,
            data: companies
        });
    } catch (error) {
        next(error);
    }
};

const updateCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        if (company.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to update this company' });
        }

        Object.assign(company, req.body);
        await company.save();
        res.status(200).json({
            success: true,
            data: company,
            message: 'Company updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

const deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        if (company.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to delete this company' });
        }

        // Delete the document instance you already found
        await company.deleteOne();

        res.status(200).json({
            success: true,
            data: company,
            message: 'Company deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

const approveCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        const { isApproved } = req.body; 
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        company.isApproved = isApproved;
        await company.save();
        res.status(200).json({
            success: true,
            data: company
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCompany,
    getCompanyById,
    getAllCompanies,
    updateCompany,
    deleteCompany,
    approveCompany
};