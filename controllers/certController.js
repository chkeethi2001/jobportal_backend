import { emailCert } from "../config/Mailconfig.js";
import { getNo_of_VideosModel } from "../models/courseModel.js";
import { getCompletedVideos } from "../models/enrollModel.js";
import { getUserByEmailService } from "../models/userModel.js";
import { generateCertificatePDF } from "../config/certConfig.js";

export const generate_cert = async (req, res) => {
  try {
    const { course_id, module_id } = req.params;
    const email = req.user.user_email;
    if (!email) {
      return res.status(403).json({ message: "provide email" });
    }
    const user = await getUserByEmailService(email);
    if (!user) {
      return res.status(403).json({ message: "No user exist" });
    }
    const AllVideos = await getNo_of_VideosModel(course_id);
    const completedVideos = await getCompletedVideos(course_id, user.id);

    if (!AllVideos || !completedVideos) {
      return res.status(403).json({ message: "No data" });
    }

    if (AllVideos) {
      const certData = {
        recipientName: user.name,
        courseName: "Machine Learning 101",
        issuerLogoUrl: "https://example.com/logo.png",
        signatureUrl: "https://example.com/signature.png",
        issuedAt: new Date(),
        certNumber: "LMS-2025-001",
        verifierUrl: "https://lms.example.com/verify/LMS-2025-001",
      };
      const { path,buffer,filename } = await generateCertificatePDF(certData);
      await emailCert(email,`${AllVideos} Certificate`,"Thank you for choosing our platform",buffer,filename);
      res
        .status(200)
        .json({ message: "Certificate has been sent to your Email" });
    }

    res.status(403).json({ message: "Please complete the course first" });
  } catch (error) {
    console.log(error)
    return res.status(403).json({ error });
  }
};
