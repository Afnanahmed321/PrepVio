// import express from 'express'
// import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../job-controllers/userController.js'
// import upload from '../config/multer.js'
// import auth from "@clerk/clerk-sdk-node";


// const router = express.Router()


// // Get user Data
// router.get('/user', auth(), getUserData)


// // Apply for a job
// router.post('/apply', applyForJob)

// // Get applied jobs data
// router.get('/applications', getUserJobApplications)

// // Update user profile (resume)
// router.post('/update-resume', upload.single('resume'), updateUserResume)

// export default router;

import express from 'express';
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../job-controllers/userController.js';
import upload from '../config/multer.js';
import { requireAuth } from "@clerk/clerk-sdk-node"; // ✅ correct import

const router = express.Router();

// Get user data (protected)
router.get('/user', requireAuth(), getUserData);

// Apply for a job (protected)
router.post('/apply', requireAuth(), applyForJob);

// Get applied jobs data (protected)
router.get('/applications', requireAuth(), getUserJobApplications);

// Update user profile (resume) (protected)
router.post('/update-resume', requireAuth(), upload.single('resume'), updateUserResume);

export default router;
