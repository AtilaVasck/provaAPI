import { Router } from "express";
import { inscriberEvent, criarEvent, editarEvent, feedbackEvent, cancelarEvent, popularEvent, agenda } from "../controllers/eventController.js";

const router = Router();

//helpers
import verifyToken from "../helpers/verify-token.js";

router.post("/criar", verifyToken, criarEvent);
router.post("/inscrever", inscriberEvent);
router.get("/agenda", agenda);
router.post("/feedback", feedbackEvent);
router.get("/mais-popular", popularEvent);
router.put("/editar", editarEvent);
router.delete("/cancelar", cancelarEvent);

export default router;