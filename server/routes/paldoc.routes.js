import PalDocController from '../controllers/paldoc.controller.js';
import authenticate from "../middleware/authenticate.js";

export default (app) => {
    router.post("/login", PalDocController.login);

    router.post("/register", PalDocController.register);

    router.post("/logout", authenticate, PalDocController.logout);
};