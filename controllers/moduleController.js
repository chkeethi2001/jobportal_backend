import {
  getAllModulesService,
  getModuleByIdService,
  createModuleService,
  updateModuleService,
  deleteModuleService,
  getModulesByCourseIdService,
  getModuleCountByCourseIdService
} from "../models/moduleModel.js"; 


const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean);
  return String(tags).split(",").map(t => t.trim()).filter(Boolean);
};

export const createModule = async (req, res) => {
  try {
    const body = { ...req.body };
    const course_id = req.params.course_id
    console.log(course_id);

    if (!course_id) return res.status(400).json({ message: "course_id is required" });
    if (!body.title) return res.status(400).json({ message: "title is required" });

    const created = await createModuleService(body,course_id);
    return res.status(201).json(created);
  } catch (err) {
    console.log("createModule error:", err);
    return res.status(500).json({ message: "Failed to create module" });
  }
};

export const getAllModules = async (req, res) => {
  try {
    const rows = await getAllModulesService();
    return res.json(rows);
  } catch (err) {
    console.error("getAllModules error:", err);
    return res.status(500).json({ message: "Failed to fetch modules" });
  }
};

export const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const mod = await getModuleByIdService(id);
    if (!mod) return res.status(404).json({ message: "Module not found" });
    return res.json(mod);
  } catch (err) {
    console.error("getModuleById error:", err);
    return res.status(500).json({ message: "Failed to fetch module" });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    const updated = await updateModuleService(id, body);
    if (!updated) return res.status(404).json({ message: "Module not found" });
    return res.json(updated);
  } catch (err) {
    console.error("updateModule error:", err);
    return res.status(500).json({ message: "Failed to update module" });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteModuleService(id);
    if (!deleted) return res.status(404).json({ message: "Module not found" });
    return res.json({ message: "Module deleted", module: deleted });
  } catch (err) {
    console.error("deleteModule error:", err);
    return res.status(500).json({ message: "Failed to delete module" });
  }
};

export const getModulesByCourseId = async (req, res) => {
  try {
    const course_id = req.params.course_id || req.query.course_id;
    if (!course_id) return res.status(400).json({ message: "Missing course_id" });

    const rows = await getModulesByCourseIdService(course_id);
    return res.json(rows);
  } catch (err) {
    console.error("getModulesByCourseId error:", err);
    return res.status(500).json({ message: "Failed to fetch modules for course" });
  }
};

export const getModuleCountByCourseId = async (req, res) => {
  try {
    const course_id = req.params.course_id || req.query.course_id;
    if (!course_id) return res.status(400).json({ message: "Missing course_id" });

    const count = await getModuleCountByCourseIdService(course_id);
    return res.json({ course_id: Number(course_id), count });
  } catch (err) {
    console.error("getModuleCountByCourseId error:", err);
    return res.status(500).json({ message: "Failed to fetch module count for course" });
  }
};
