const Application = require('../models/Application');
const Company = require('../models/Company');
const Job = require('../models/Job');


const applyToJob = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    // CV Upload Check: Ensure a CV file or link is provided
    const cvPath = req.file ? req.file.path : req.body.cvUrl;
    if (!cvPath) {
      return res.status(400).json({ 
        success: false, 
        message: 'CV upload is required to submit an application.' 
      });
    }

    // Fetch Job Details & Status Checks
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // Check if the job is approved by admin/moderator
   if (job.status !== 'approved') {
    return res.status(400).json({ error: 'This job is not available' });
}

    const existingApplication = await Application.findOne({job: jobId, applicant: userId});
    if (existingApplication) {
      return res.status(400).json({success: false, message: 'You have already applied for this job.' });
    }

    // Check application deadline
    if (new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({ 
        success: false, 
        message: 'The application deadline for this job has passed.' 
      });
    }

// Check max applicants limit
const applicationCount = await Application.countDocuments({ job: jobId });

if (applicationCount >= job.maxApplicants) {
  return res.status(400).json({ 
    success: false, 
    message: 'This job has reached its maximum applicant limit.' 
  });
} else if (applicationCount + 1 >= job.maxApplicants) {
  job.status = 'closed';
  await job.save();
}

    const newApplication = new Application({
    job: jobId,
    applicant: userId,  
    cv: cvPath,
    });

    await newApplication.save();

    return res.status(201).json({
      success: true,
      message: 'Job application submitted successfully.',
      data: newApplication
    });

  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const applications = await Application.find({applicant: userId}).populate('job', 'title company location jobType status');
        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
    
};

const getJobApplications = async (req, res, next) => {
    try{
        const { jobId } = req.params;
        const company = await Company.findOne({ user: req.user.id });

        // 1. Find the job and verify ownership
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.'
      });
    }

    // Check if the logged-in company owns this job
    if (!company || job.company.toString() !== company._id.toString()) {
    return res.status(403).json({ error: 'Not authorized' });
}

    // Fetch all applications for the verified job
    const applications = await Application.find({ job: jobId }).populate('applicant', 'name email').sort({ createdAt: -1 });

    // Return the applications
    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
    } catch(error){
        next(error);
    }
};

    const updateApplicationStatus = async (req, res, next) => {
    try {
    const application = await Application.findById(req.params.id);
    const company = await Company.findOne({ user: req.user.id });
    const job = await Job.findById(application.job);
    const { status } = req.body;

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    } 

    if (!company || job.company.toString() !== company._id.toString()) {
    return res.status(403).json({ error: 'Not authorized' });
    }

    if (!['applied', 'reviewing', 'interview', 'offered', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Status must be one of: applied, reviewing, interview, offered, rejected'
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
};