import { Router } from "express";
import { registerPalestrante, checkPalestrante, atividadePalestrante } from "../controllers/palestranteController.js";

const router = Router();

router.post("/registerPalestrantes", registerPalestrante);
router.get("/checkPalestrantes", checkPalestrante);
router.get("/palestrante-mais-ativo", atividadePalestrante);

export default router;