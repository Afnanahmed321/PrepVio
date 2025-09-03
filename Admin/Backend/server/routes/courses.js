import express from "express";
import Course from "../models/Course.js";
import Channel from "../models/Channel.js";

const router = express.Router();

// ✅ Create course
router.post("/", async (req, res) => {
  try {
    const { name, description, imageUrl, channels } = req.body;

    const course = new Course({ name, description, imageUrl, channels: channels || [] });
    await course.save();

    // Sync: add course to channels
    if (channels && channels.length > 0) {
      await Channel.updateMany(
        { _id: { $in: channels } },
        { $addToSet: { courses: course._id } }
      );
    }

    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("channels");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get single course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("channels");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update course
router.put("/:id", async (req, res) => {
  try {
    const { name, description, imageUrl, channels } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.name = name || course.name;
    course.description = description || course.description;
    course.imageUrl = imageUrl || course.imageUrl;
    if (channels) course.channels = channels;

    await course.save();

    // Sync channels
    if (channels) {
      await Channel.updateMany(
        { _id: { $nin: channels }, courses: course._id },
        { $pull: { courses: course._id } }
      );
      await Channel.updateMany(
        { _id: { $in: channels } },
        { $addToSet: { courses: course._id } }
      );
    }

    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete course
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Remove course from all channels
    await Channel.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );

    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
