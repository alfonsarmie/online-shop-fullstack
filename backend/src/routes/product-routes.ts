import { Router } from 'express';
import { check } from 'express-validator';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getProduct 
} from '../controllers/product-controller';
import { validateFields } from '../middlewares/validate-fields';
import { validateJWT } from '../middlewares/validate-jwt';

const router = Router();

// GET - Obtener todos los productos (pública)
router.get("/", getAllProducts);

// GET - Obtener un producto por ID (pública)
router.get("/:id", [
  check('id', 'ID must be a number').isNumeric(),
  validateFields
], getProduct);

// POST - Crear producto (solo admin)
router.post("/create", [
  validateJWT,
  check('name', 'Product name is required').notEmpty(),
  check('name', 'Product name must be at most 150 characters').isLength({ max: 150 }),
  check('description', 'Product description must be at most 500 characters').optional().isLength({ max: 500 }),
  check('stock', 'Stock must be a non-negative integer').isInt({ min: 0 }),
  check('idCategory', 'Category ID is required').isInt({ min: 1 }),
  validateFields
], createProduct);

// PUT - Actualizar producto (solo admin)
router.put("/update/:id", [
  validateJWT,
  check('id', 'ID must be a number').isNumeric(),
  check('name', 'Product name must be at most 150 characters').optional().isLength({ max: 150 }),
  check('description', 'Product description must be at most 500 characters').optional().isLength({ max: 500 }),
  check('stock', 'Stock must be a non-negative integer').optional().isInt({ min: 0 }),
  check('idCategory', 'Category ID must be a number').optional().isInt({ min: 1 }),
  validateFields
], updateProduct);

// DELETE - Eliminar producto (solo admin)
router.delete("/delete/:id", [
  validateJWT,
  check('id', 'ID must be a number').isNumeric(),
  validateFields
], deleteProduct);

export default router;