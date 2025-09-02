import express from "express";
import CoursesModel from "../models/courses.model.js";

const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await CoursesModel.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET course by slug
router.get("/:slug", async (req, res) => {
  try {
    const course = await CoursesModel.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new course
router.post("/", async (req, res) => {
  const { title, description, image } = req.body;

  const newCourse = new CoursesModel({
    title,
    description,
    image,
  });

  try {
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
