// controllers/assignmentController.js
import {
  getAllAssignmentsService,
  getAssignmentByIdService,
  createAssignmentService,
  updateAssignmentService,
  deleteAssignmentService,
  getAssignmentsByModuleIdService,
  getAssignmentCountByModuleIdService,
  getDueAssignmentsService,
  getOverdueAssignmentsService,
  getAssignmentCountService,
  getAssignmentsByTypeService,
  getAssignmentsBySubmissionTypeService,
  getAssignmentsByDueDateRangeService,
  getAssignmentsByResourceService,
  getAssignmentsByTitleService
} from "../models/assignmentModel.js"; 

// GET /assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await getAllAssignmentsService();
    return res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error("getAllAssignments:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /assignments/:id
export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await getAssignmentByIdService(id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    return res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    console.error("getAssignmentById:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /assignments
export const createAssignment = async (req, res) => {
  try {
    const assignmentData = req.body;
    // Optional minimal validation
    if (!assignmentData.module_id || !assignmentData.title) {
      return res.status(400).json({ success: false, message: "module_id and title are required" });
    }

    const created = await createAssignmentService(assignmentData);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("createAssignment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /assignments/:id
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignmentData = req.body;

    const updated = await updateAssignmentService(id, assignmentData);
    if (!updated) return res.status(404).json({ success: false, message: "Assignment not found" });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("updateAssignment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /assignments/:id
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteAssignmentService(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Assignment not found" });
    return res.status(200).json({ success: true, data: deleted });
  } catch (err) {
    console.error("deleteAssignment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /modules/:module_id/assignments
export const getAssignmentsByModuleId = async (req, res) => {
  try {
    const { module_id } = req.params;
    const assignments = await getAssignmentsByModuleIdService(module_id);
    return res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error("getAssignmentsByModuleId:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /modules/:module_id/assignments/count
export const getAssignmentCountByModuleId = async (req, res) => {
  try {
    const { module_id } = req.params;
    const count = await getAssignmentCountByModuleIdService(module_id);
    return res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("getAssignmentCountByModuleId:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /assignments/due?currentDate=YYYY-MM-DD (optional query)
export const getDueAssignments = async (req, res) => {
  try {
    const { currentDate } = req.query;
    const date = currentDate || new Date().toISOString(); // service expects a date string
    const assignments = await getDueAssignmentsService(date);
    return res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error("getDueAssignments:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /assignments/overdue?currentDate=YYYY-MM-DD (optional query)
export const getOverdueAssignments = async (req, res) => {
  try {
    const { currentDate } = req.query;
    const date = currentDate || new Date().toISOString();
    const assignments = await getOverdueAssignmentsService(date);
    return res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error("getOverdueAssignments:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /assignments/count
export const getAssignmentCount = async (req, res) => {
  try {
    const count = await getAssignmentCountService();
    return res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("getAssignmentCount:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /assignments/type/:assignment_type
export const getAssignmentsByType = async (req, res) => {
  try {
    const { assignment_type } = req.params;
    const assignments = await getAssignmentsByTypeService(assignment_type);
    return res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error("getAssignmentsByType:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /assignments/submission/:submission_type
export const getAssignmentsBySubmissionType = async (req, res) => {
  try {
    const { submission_type } = req.params;
    const assignments = await getAssignmentsBySubmissionTypeService(submission_type);
    return res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error("getAssignmentsBySubmissionType:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /assignments/daterange?start=YYYY-MM-DD&end=YYYY-MM-DD
export const getAssignmentsByDueDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ success: false, message: "start and end query params are required" });
    }
    const assignments = await getAssignmentsByDueDateRangeService(start, end);
    return res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error("getAssignmentsByDueDateRange:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /assignments/resource?resource=someResource
export const getAssignmentsByResource = async (req, res) => {
  try {
    const { resource } = req.query;
    if (!resource) return res.status(400).json({ success: false, message: "resource query param is required" });

    const assignments = await getAssignmentsByResourceService(resource);
    return res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error("getAssignmentsByResource:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /assignments/search?title=foo
export const getAssignmentsByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ success: false, message: "title query param is required" });

    const assignments = await getAssignmentsByTitleService(title);
    return res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error("getAssignmentsByTitle:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
