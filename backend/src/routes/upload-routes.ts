// routes/upload-routes.ts - CORREGIDO
import { Router } from 'express';
import { uploadImage } from '../controllers/upload-controller'; // ✅ Importación correcta
import { validateJWT } from '../middlewares/validate-jwt';

const router = Router();

router.post("/upload", [
  validateJWT
], uploadImage);

export default router;