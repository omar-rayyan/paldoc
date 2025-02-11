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

  app.get("/api/paldoc/getdoctors", PalDocController.getDoctors);

  app.get("/api/paldoc/admin/getpatients", authenticateAdmin, PalDocController.getPatients);

  app.get("/api/paldoc/getuser", authenticate, PalDocController.getUser);

  app.get("/api/paldoc/health-history", authenticate, PalDocController.getHealthHistory);

  app.post("/api/paldoc/patient/health-history", authenticate, PalDocController.saveHealthHistory);

  app.post("/api/paldoc/doctor/availability", authenticate, PalDocController.setAvailability);

  app.post("/api/paldoc/doctor/verification", authenticate, PalDocController.verifyDoctor);

  app.get("/api/paldoc/doctor-status/:userId", authenticate, PalDocController.doctorStatus);

  app.put("/api/paldoc/profile/update", authenticate, PalDocController.updateProfile);

  app.delete("/api/paldoc/admin/deleteuser/:id", authenticateAdmin, PalDocController.deleteUser);

  app.post("/api/paldoc/upload", authenticate, upload.single('file'), PalDocController.uploadFile);
};