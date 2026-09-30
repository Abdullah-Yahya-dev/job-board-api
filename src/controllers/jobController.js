const Job = require('../models/Job');
const Company = require('../models/Company');


const createJob = async (req, res, next) => {
    try {
        const company = await Company.findOne({ user: req.user.id });
        if (!company) {
    return res.status(404).json({ error: 'Company not found' });
    }
    if (!company.isApproved) {
    return res.status(403).json({ error: 'Your company is not approved' });
    }
        const job = await Job.create({ ...req.body, company: company._id });
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

const getAllJobs = async (req, res, next) => {
    try{
        const { jobType, workMode, experienceLevel, minSalary, maxSalary, applicationDeadline, search, page =1, limit =5 } = req.query;

        const query = { status: 'approved' };

        if (jobType) {
            query.jobType = jobType;
        }
        if (workMode) {
            query.workMode = workMode;
        }
        if (experienceLevel) {
            query.experienceLevel = experienceLevel;
        }
        if (minSalary) { 
            query['salary.min'] = { $gte: Number(minSalary) }; 
        }
        if (maxSalary) { 
            query['salary.max'] = { $lte: Number(maxSalary) }; 
        }
        
        if (applicationDeadline) {
            query.applicationDeadline = { $lte: applicationDeadline };
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const [jobs, totalJobs] = await Promise.all([
            Job.find(query).skip(skip).limit(limitNumber),
            Job.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: jobs,
            totalJobs,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalJobs / limitNumber)
        });

    } catch (error) {
        next(error);
    }

};

const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('company');
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        if (job.status !== 'approved') {
            const company = await Company.findOne({ user: req.user?.id });
        const isOwner = company && job.company.equals(company._id);
        const isAdmin = req.user?.role === 'admin';
        if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'This job is not available' });
        }
        }
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};


const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        const company = await Company.findOne({ user: req.user.id });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (!company || !job.company.equals(company._id)) {
            return res.status(403).json({ error: 'You are not authorized to update this job' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: updatedJob });
    } catch (error) {
        next(error);
    }
};

const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        const company = await Company.findOne({ user: req.user.id });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        const isOwner = company && job.company.equals(company._id);
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Not authorized' });
        }
        await job.deleteOne();
        res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};


const getMyJobs = async (req, res, next) => {
    try {
        const company = await Company.findOne({ user: req.user.id });
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        const jobs = await Job.find({ company: company._id });
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        next(error);
    }
};

const approveJob = async (req, res, next) => {
    try{
        const job = await Job.findById(req.params.id);
        const { status, rejectionReason } = req.body;
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status must be approved or rejected' });
        }

        job.status = status;

        if (status === 'rejected' && rejectionReason) {
        job.rejectionReason = rejectionReason;
        }

        await job.save();
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
    approveJob
};