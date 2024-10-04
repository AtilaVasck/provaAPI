import { Router } from "express";
import { registerParticipante, participanteMaisAtivo, listarAllEventsParticipante } from "../controllers/participanteController.js";

const router = Router();

router.post("/participante/registrar", registerParticipante);
router.get("/meus-eventos", listarAllEventsParticipante);

export default router;