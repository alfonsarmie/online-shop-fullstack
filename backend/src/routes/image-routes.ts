import { Router } from 'express';
import { check } from 'express-validator';
import { addImage, getProductImages, deleteImage } from '../controllers/image-controller';
import { validateFields } from '../middlewares/validate-fields';
import { validateJWT } from '../middlewares/validate-jwt';

const router = Router();

router.post("/:idProduct/add", [
  validateJWT,
  check('url', 'URL is required').notEmpty(),
  check('url', 'URL must be a valid URL').isURL(),
  validateFields
], addImage);

router.get("/:idProduct/images", getProductImages);

router.delete("/:idProduct/delete/:url", [
  validateJWT
], deleteImage);

export default router;