import PalDocController from '../controllers/paldoc.controller.js';
import { authenticate, authenticateAdmin } from "../middleware/authenticate.js";

export default (app) => {
    app.post("/api/paldoc/login", PalDocController.login);

    app.post("/api/paldoc/register", PalDocController.register);

    app.post("/api/paldoc/logout", authenticate, PalDocController.logout);

    app.get("/api/paldoc/authenticate", authenticate, PalDocController.authenticate);

    app.get("/api/paldoc/doctor-status/:userId", authenticate, PalDocController.doctorStatus);
};