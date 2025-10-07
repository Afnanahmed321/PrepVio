import Job from "../job-models/Job.js"
import JobApplication from "../job-models/JobApplication.js"
import User from "../job-models/User.js"
import { v2 as cloudinary } from "cloudinary"
import { clerkClient } from "@clerk/clerk-sdk-node";


// Get User Data
// export const getUserData = async (req, res) => {
//     const { userId } = req.auth(); // ✅ updated

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.json({ success: false, message: 'User Not Found' });
//         }

//         res.json({ success: true, user });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }

export const getUserData = async (req, res) => {
  const userId = req.auth?.userId; // safe check

  if (!userId) {
    return res.json({ success: false, message: "User not authenticated" });
  }

  try {
    // Check if user exists in MongoDB
    let user = await User.findById(userId);

    if (!user) {
      // Fetch user from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);

      user = new User({
        _id: clerkUser.id,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        email: clerkUser.emailAddresses[0].emailAddress,
        image: clerkUser.imageUrl,
        resume: "",
      });

      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//   const { userId } = req.auth; // Clerk attaches this automatically

//   try {
//     // Check if user already exists in DB
//     let user = await User.findById(userId);

//     if (!user) {
//       // Fetch user data from Clerk
//       const clerkUser = await clerkClient.users.getUser(userId);

//       // Create a new user in MongoDB
//       user = new User({
//         _id: clerkUser.id,
//         name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
//         email: clerkUser.emailAddresses[0].emailAddress,
//         image: clerkUser.imageUrl,
//         resume: ""
//       });

//       await user.save();
//     }

//     res.json({ success: true, user });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };



// Apply For Job

export const applyForJob = async (req, res) => {

    const { jobId } = req.body

    const userId = req.auth.userId

    try {

        const isAlreadyApplied = await JobApplication.find({ jobId, userId })

        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: 'Already Applied' })
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({ success: false, message: 'Job Not Found' })
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({ success: true, message: 'Applied Successfully' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Get User Applied Applications Data
export const getUserJobApplications = async (req, res) => {

    try {

        const userId = req.auth.userId

        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()

        if (!applications) {
            return res.json({ success: false, message: 'No job applications found for this user.' })
        }

        return res.json({ success: true, applications })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Update User Resume
export const updateUserResume = async (req, res) => {
    try {

        const userId = req.auth.userId

        const resumeFile = req.file

        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        return res.json({ success: true, message: 'Resume Updated' })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

