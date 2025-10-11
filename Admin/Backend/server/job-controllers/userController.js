// // import Job from "../job-models/Job.js"
// // import JobApplication from "../job-models/JobApplication.js"
// // import User from "../job-models/User.js"
// // import { v2 as cloudinary } from "cloudinary"
// // import { clerkClient } from "@clerk/clerk-sdk-node";

// // // Get User Data
// // export const getUserData = async (req, res) => {
// //   const userId = req.auth?.userId; // safe check

// //   if (!userId) {
// //     return res.json({ success: false, message: "User not authenticated" });
// //   }

// //   try {
// //     // 1. Check if user exists in MongoDB
// //     let user = await User.findById(userId);

// //     try {
// //       // 2. Try fetching user from Clerk (Source of truth)
// //       const clerkUser = await clerkClient.users.getUser(userId);

// //       if (!user) {
// //         // 3. If user not in DB but exists in Clerk, save to DB (First-time sync)
// //         user = new User({
// //           _id: clerkUser.id,
// //           name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
// //           email: clerkUser.emailAddresses[0].emailAddress,
// //           image: clerkUser.imageUrl,
// //           resume: "",
// //         });
// //         await user.save();
// //       }
// //     } catch (clerkError) {
// //       // ⚠️ IMPORTANT: Log the error to find the exact structure of the "Not Found" error
// //       console.error("Clerk API Error Occurred:", clerkError);
      
// //       // ✅ Current Best Guess for Clerk's "Not Found" status: 404
// //       const isNotFoundError = clerkError.status === 404; 

// //       // If the 404 check still fails after running this, check the console output
// //       // for properties like clerkError.name, clerkError.code, or clerkError.message 
// //       // and update the `isNotFoundError` condition accordingly.
      
// //       if (isNotFoundError) {
          
// //           if (user) {
// //               // User was found in DB, but is confirmed deleted/not found in Clerk -> Delete from DB
// //               console.log(`Clerk user ${userId} confirmed not found. Deleting MongoDB user.`);
// //               await User.findByIdAndDelete(userId);
// //               return res.json({ success: false, message: "User account deleted" });
// //           } else {
// //               // User not in DB AND confirmed not in Clerk
// //               return res.json({ success: false, message: "User not found" });
// //           }
          
// //       } else {
// //           // This handles other transient Clerk errors (network, server issues, etc.)
// //           console.error("Clerk API error during login/sync:", clerkError.message);
// //           return res.json({ 
// //               success: false, 
// //               message: `Authentication Error: Could not sync user data. (Clerk API issue)` 
// //           });
// //       }
// //     }

// //     // 5. Success
// //     res.json({ success: true, user });
// //   } catch (error) {
// //     console.error("Error in getUserData (MongoDB failure):", error);
// //     res.json({ success: false, message: error.message });
// //   }
// // };


// // // Apply For Job
// // export const applyForJob = async (req, res) => {

// //     const { jobId } = req.body

// //     const userId = req.auth.userId

// //     try {

// //         const isAlreadyApplied = await JobApplication.find({ jobId, userId })

// //         if (isAlreadyApplied.length > 0) {
// //             return res.json({ success: false, message: 'Already Applied' })
// //         }

// //         const jobData = await Job.findById(jobId)

// //         if (!jobData) {
// //             return res.json({ success: false, message: 'Job Not Found' })
// //         }

// //         await JobApplication.create({
// //             companyId: jobData.companyId,
// //             userId,
// //             jobId,
// //             date: Date.now()
// //         })

// //         res.json({ success: true, message: 'Applied Successfully' })

// //     } catch (error) {
// //         res.json({ success: false, message: error.message })
// //     }

// // }

// // // Get User Applied Applications Data
// // export const getUserJobApplications = async (req, res) => {

// //     try {

// //         const userId = req.auth.userId

// //         const applications = await JobApplication.find({ userId })
// //             .populate('companyId', 'name email image')
// //             .populate('jobId', 'title description location category level salary')
// //             .exec()

// //         if (!applications || applications.length === 0) {
// //             return res.json({ success: true, applications: [], message: 'No job applications found for this user.' })
// //         }

// //         return res.json({ success: true, applications })

// //     } catch (error) {
// //         res.json({ success: false, message: error.message })
// //     }

// // }

// // // Update User Resume
// // export const updateUserResume = async (req, res) => {
// //     try {

// //         const userId = req.auth.userId

// //         const resumeFile = req.file

// //         const userData = await User.findById(userId)

// //         if (!userData) {
// //             return res.json({ success: false, message: 'User Not Found' })
// //         }

// //         if (resumeFile) {
// //             const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, { resource_type: "auto" })
// //             userData.resume = resumeUpload.secure_url
// //         }

// //         await userData.save()

// //         return res.json({ success: true, message: 'Resume Updated' })

// //     } catch (error) {

// //         console.error("Error in updateUserResume:", error);
// //         res.json({ success: false, message: error.message })

// //     }
// // }

// import Job from "../job-models/Job.js"
// import JobApplication from "../job-models/JobApplication.js"
// // import User from "../job-models/User.js"
// import { v2 as cloudinary } from "cloudinary"
// import { clerkClient } from "@clerk/clerk-sdk-node";

// // Get User Data
// export const getUserData = async (req, res) => {
//   const userId = req.auth?.userId;

//   if (!userId) {
//     return res.json({ success: false, message: "User not authenticated" });
//   }

//   try {
//     // Check if user exists in MongoDB
//     let user = await User.findById(userId);

//     if (!user) {
//       // If user not in DB, fetch from Clerk and save
//       try {
//         const clerkUser = await clerkClient.users.getUser(userId);
        
//         user = new User({
//           _id: clerkUser.id,
//           name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
//           email: clerkUser.emailAddresses[0].emailAddress,
//           image: clerkUser.imageUrl,
//           resume: "",
//         });
//         await user.save();
//       } catch (clerkError) {
//         return res.json({ success: false, message: "User not found" });
//       }
//     }

//     res.json({ success: true, user });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // Apply For Job
// export const applyForJob = async (req, res) => {
//   const { jobId } = req.body;
//   const userId = req.auth.userId;

//   try {
//     const isAlreadyApplied = await JobApplication.find({ jobId, userId });

//     if (isAlreadyApplied.length > 0) {
//       return res.json({ success: false, message: 'Already Applied' });
//     }

//     const jobData = await Job.findById(jobId);

//     if (!jobData) {
//       return res.json({ success: false, message: 'Job Not Found' });
//     }

//     await JobApplication.create({
//       companyId: jobData.companyId,
//       userId,
//       jobId,
//       date: Date.now()
//     });

//     res.json({ success: true, message: 'Applied Successfully' });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // Get User Applied Applications Data
// export const getUserJobApplications = async (req, res) => {
//   try {
//     const userId = req.auth.userId;

//     const applications = await JobApplication.find({ userId })
//       .populate('companyId', 'name email image')
//       .populate('jobId', 'title description location category level salary')
//       .exec();

//     if (!applications) {
//       return res.json({ success: false, message: 'No job applications found for this user.' });
//     }

//     return res.json({ success: true, applications });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // Update User Resume
// export const updateUserResume = async (req, res) => {
//   try {
//     const userId = req.auth.userId;
//     const resumeFile = req.file;

//     const userData = await User.findById(userId);

//     if (!userData) {
//       return res.json({ success: false, message: 'User not found' });
//     }

//     if (resumeFile) {
//       const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
//       userData.resume = resumeUpload.secure_url;
//     }

//     await userData.save();

//     return res.json({ success: true, message: 'Resume Updated' });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };