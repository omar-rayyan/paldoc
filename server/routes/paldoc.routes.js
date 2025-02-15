import PalDocController from '../controllers/paldoc.controller.js';
import { authenticate, authenticateAdmin } from "../middleware/authenticate.js";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

export default (app) => {
  app.post("/api/paldoc/login", PalDocController.login);

  app.post("/api/paldoc/register", PalDocController.register);

  app.post("/api/paldoc/logout", authenticate, PalDocController.logout);

  app.get("/api/paldoc/authenticate", authenticate, PalDocController.authenticate);

  app.get("/api/paldoc/availability/:doctorId", authenticate, PalDocController.getDoctorAvailability);

  app.get("/api/paldoc/getapproveddoctors", PalDocController.getApprovedDoctors);

  app.get("/api/paldoc/admin/getpatients", authenticateAdmin, PalDocController.getPatients);

  app.get("/api/paldoc/admin/getappointments", authenticateAdmin, PalDocController.getAppointments);

  app.get("/api/paldoc/admin/getdoctors", authenticateAdmin, PalDocController.getDoctors);

  app.get("/api/paldoc/doctor/availability", authenticate, PalDocController.getPersonalAvailabilities);

  app.get("/api/paldoc/patient/getappointments", authenticate, PalDocController.getPatientAppointments);

  app.put("/api/paldoc/doctor/appointments/:id/finish", authenticate, PalDocController.markAppointmentAsFinished);

  app.get("/api/paldoc/doctor/getappointments", authenticate, PalDocController.getDoctorAppointments);

  app.get("/api/paldoc/getuser", authenticate, PalDocController.getUser);

  app.get("/api/paldoc/healthhistory", authenticate, PalDocController.getHealthHistory);

  app.get("/api/paldoc/messages/:chatId", authenticate, PalDocController.getMessages);

  app.post("/api/paldoc/startchat/:id", authenticate, PalDocController.startChat);

  app.post("/api/paldoc/messages/send", authenticate, PalDocController.sendMessage);

  app.get("/api/paldoc/chats", authenticate, PalDocController.getActiveChats);

  app.get("/api/paldoc/healthhistory/:id", authenticate, PalDocController.getPatientHealthHistory);

  app.post("/api/paldoc/patient/health-history", authenticate, PalDocController.saveHealthHistory);

  app.post("/api/paldoc/doctor/availability", authenticate, PalDocController.setAvailability);

  app.put("/api/paldoc/doctor/availability", authenticate, PalDocController.updateAvailabilities);

  app.post("/api/paldoc/admin/approvedoctor/:id", authenticateAdmin, PalDocController.approveDoctor);

  app.post("/api/paldoc/doctor/verification", authenticate, PalDocController.verifyDoctor);

  app.post("/api/paldoc/appointments/book", authenticate, PalDocController.bookAppointment);

  app.post("/api/paldoc/ai-chat-message", authenticate, PalDocController.aiChatMessage);

  app.get("/api/paldoc/doctor-status/:userId", authenticate, PalDocController.doctorStatus);

  app.put("/api/paldoc/profile/update", authenticate, PalDocController.updateProfile);

  app.delete("/api/paldoc/admin/deleteuser/:id", authenticateAdmin, PalDocController.deleteUser);

  app.post("/api/paldoc/upload", authenticate, upload.single('file'), PalDocController.uploadFile);

  app.post("/api/paldoc/pic/upload", authenticate, upload.single('file'), PalDocController.uploadFilePic);
};