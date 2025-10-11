import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category-controller';
import { validateJWT } from '../middlewares/validate-jwt'; // Ajusta la ruta según tu estructura

const router = Router();

// GET /api/categories - get all categories (público)
router.get('/', getCategories);

// GET /api/categories/:id - get a category by ID (público)
router.get('/:id', getCategoryById);

// the following routes require admin permissions
router.post('/', validateJWT, createCategory);
router.put('/:id', validateJWT, updateCategory);
router.delete('/:id', validateJWT, deleteCategory);

export default router;