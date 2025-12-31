import { getCourseByIdService } from "../models/courseModel.js";
import { createEnrollModel, Does_Pair_exist } from "../models/enrollModel.js";
import { getUserByEmailService } from "../models/userModel.js";

export const createEnrollService = async (req, res) => {
  try {
    const { course_id } = req.params;
    const email = req.user.user_email;

    const course = await getCourseByIdService(course_id);
    if (!course) {
      return res.status(404).json({ message: "The course doesn't exist" });
    }

    const user = await getUserByEmailService(email);
    if (!user) {
      return res.status(403).json({ message: "The user doesn't exists" });
    }
    if (!Does_Pair_exist(course_id, user.id)) {
      const result = createEnrollModel(course_id, user.id);
      if (!result) {
        return res.status(403).json({ message: "Somethong went wrong" });
      }
      return res.status(201).json({ message: result });
    }
    return res.status(403).json({message:"user is already enrolled"});
  } catch (error) {
    res.status(403).json({ error });
  }
};
