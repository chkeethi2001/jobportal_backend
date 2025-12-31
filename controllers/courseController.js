import {
  getAllCoursesService,
  createCourseService,
  updateCourseService,
  deleteCourseService,
  getCoursesByCategoryService,
  getCoursesByInstructorService,
  getPublishedCoursesService,
  getCoursesByLevelService,
  getCoursesByTagService,
  getCourseCountService,
  getPublishedCourseCountService,
  getUnpublishedCourseCountService,
  getCoursesByLanguageService,
  getCoursesByPriceRangeService,
  getCoursesByDurationService,
  getCoursesWithPaginationService,
  searchCoursesService,
  getRecentCoursesService,
  getCourseByUserIdService,
  getCourseByIdService,
} from "../models/courseModel.js";
import { getUserByEmailService } from "../models/userModel.js";

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags))
    return tags.map((t) => String(t).trim()).filter(Boolean);

  return String(tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

export const createCourse = async (req, res) => {
  try {
    const body = { ...req.body };
    const user_email = req.user.user_email;
    const user = await getUserByEmailService(user_email);
    console.log(user.id);
    if (body.tags) body.tags = normalizeTags(body.tags);

    const created = await createCourseService(body, user.id);
    return res.status(201).json(created);
  } catch (err) {
    console.error("createCourse error:", err);
    return res.status(500).json({ message: "Failed to create course" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const rows = await getAllCoursesService();
    return res.json(rows);
  } catch (err) {
    console.error("getAllCourses error:", err);
    return res.status(500).json({ message: "Failed to fetch courses" });
  }
};

export const getCourseByUserId = async (req, res) => {
  try {
    const email = req.user?.user_email;
    if (!email) {
      return res.status(403).json({ message: "Need Email" });
    }
    const user = await getUserByEmailService(email);
    if (!user) {
      return res.status(403).json({ message: "No user" });
    }
    const userId = Number(user.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const course = await getCourseByUserIdService(userId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.json(course);
  } catch (err) {
    console.error("getCourseByUserId error:", err);
    return res.status(500).json({ message: "Failed to fetch course" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(403).json({ message: "Please provide id" });
    }
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const course = await getCourseByIdService(id);
    if (!course) {
      return res.status(403).json({ message: "no coruses by that id" });
    }
    return res.status(200).json({ course });
  } catch (error) {
    return res.status(403).json({ error });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    if (body.tags) body.tags = normalizeTags(body.tags);

    const updated = await updateCourseService(id, body);
    if (!updated) return res.status(404).json({ message: "Course not found" });
    return res.json(updated);
  } catch (err) {
    console.error("updateCourse error:", err);
    return res.status(500).json({ message: "Failed to update course" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const user_email = req.user.user_email;
    const user = await getUserByEmailService(user_email);

    console.log(user);

    const deleted = await deleteCourseService(id, user.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    return res.json({ message: "Course deleted", course: deleted });
  } catch (err) {
    console.error("deleteCourse error:", err);
    return res.status(500).json({ message: "Failed to delete course" });
  }
};

export const getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params; // or req.query
    const rows = await getCoursesByCategoryService(category);
    return res.json(rows);
  } catch (err) {
    console.error("getCoursesByCategory error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch courses by category" });
  }
};

export const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructor } = req.params; // or req.query
    const rows = await getCoursesByInstructorService(instructor);
    return res.json(rows);
  } catch (err) {
    console.error("getCoursesByInstructor error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch courses by instructor" });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const rows = await getPublishedCoursesService();
    return res.json(rows);
  } catch (err) {
    console.error("getPublishedCourses error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch published courses" });
  }
};

export const getCoursesByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const rows = await getCoursesByLevelService(level);
    return res.json(rows);
  } catch (err) {
    console.error("getCoursesByLevel error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch courses by level" });
  }
};

export const getCoursesByTag = async (req, res) => {
  try {
    const { tag } = req.params; // or req.query
    const rows = await getCoursesByTagService(tag);
    return res.json(rows);
  } catch (err) {
    console.error("getCoursesByTag error:", err);
    return res.status(500).json({ message: "Failed to fetch courses by tag" });
  }
};

export const getCourseCounts = async (req, res) => {
  try {
    const [total, published, unpublished] = await Promise.all([
      getCourseCountService(),
      getPublishedCourseCountService(),
      getUnpublishedCourseCountService(),
    ]);
    return res.json({ total, published, unpublished });
  } catch (err) {
    console.error("getCourseCounts error:", err);
    return res.status(500).json({ message: "Failed to fetch course counts" });
  }
};

export const getCoursesByLanguage = async (req, res) => {
  try {
    const { language } = req.params;
    const rows = await getCoursesByLanguageService(language);
    return res.json(rows);
  } catch (err) {
    console.error("getCoursesByLanguage error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch courses by language" });
  }
};

export const getCoursesByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || 0;
    const rows = await getCoursesByPriceRangeService(min, max);
    return res.json(rows);
  } catch (err) {
    console.error("getCoursesByPriceRange error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch courses by price range" });
  }
};

export const getCoursesByDuration = async (req, res) => {
  try {
    const { minDuration, maxDuration } = req.query;
    const min = Number(minDuration) || 0;
    const max = Number(maxDuration) || 0;
    const rows = await getCoursesByDurationService(min, max);
    return res.json(rows);
  } catch (err) {
    console.error("getCoursesByDuration error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch courses by duration" });
  }
};

export const getCoursesWithPagination = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const offset = (page - 1) * limit;
    const rows = await getCoursesWithPaginationService(limit, offset);
    return res.json({ data: rows, meta: { page, limit } });
  } catch (err) {
    console.error("getCoursesWithPagination error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch paginated courses" });
  }
};

export const searchCourses = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res.status(400).json({ message: "Missing search query 'q'" });
    const rows = await searchCoursesService(q);
    return res.json(rows);
  } catch (err) {
    console.error("searchCourses error:", err);
    return res.status(500).json({ message: "Failed to search courses" });
  }
};

export const getRecentCourses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const rows = await getRecentCoursesService(limit);
    return res.json(rows);
  } catch (err) {
    console.error("getRecentCourses error:", err);
    return res.status(500).json({ message: "Failed to fetch recent courses" });
  }
};
