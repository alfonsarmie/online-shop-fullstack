import { Router } from 'express';
import { check } from 'express-validator';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getProduct, 
  getCriticalProducts,
  getTopFive
} from '../controllers/product-controller';
import { validateFields } from '../middlewares/validate-fields';
import { validateJWT, allowAdminOrReceptionist } from '../middlewares/validate-jwt';

const router = Router();

/**
 * @route   GET /api/products/topfive
 * @desc    Obtiene los 5 productos más vendidos
 * @access  Private/Admin
 */

router.get('/topfive',[validateJWT,getTopFive]);

/**
 * @route   GET /api/products/critical
 * @desc    Obtiene productos con stock crítico (por debajo del parámetro especificado)
 * @access  Private/Admin
 */

router.get('/critical',[validateJWT],getCriticalProducts)

/**
 * @route   GET /api/products
 * @desc    Obtiene todos los productos con opción de búsqueda
 * @access  Public
 */

router.get("/", getAllProducts);

/**
 * @route   GET /api/products
 * @desc    Obtiene todos los productos con opción de búsqueda
 * @access  Public
 */

router.get("/:id", [
  check('id', 'ID must be a number').isNumeric(),
  validateFields
], getProduct);

/**
 * @route   POST /api/products/create
 * @desc    Crea un nuevo producto
 * @access  Private/Admin
 */

router.post("/create", [
  validateJWT,
  check('name', 'Product name is required').notEmpty(),
  check('name', 'Product name must be at most 150 characters').isLength({ max: 150 }),
  check('description', 'Product description must be at most 500 characters').optional().isLength({ max: 500 }),
  check('stock', 'Stock must be a non-negative integer').isInt({ min: 0 }),
  check('idCategory', 'Category ID is required').isInt({ min: 1 }),
  validateFields
], createProduct);

/**
 * @route   PUT /api/products/update/:id
 * @desc    Actualiza un producto existente
 * @access  Private/Admin/Receptionist
 */

router.put("/update/:id", [
  allowAdminOrReceptionist,
  check('id', 'ID must be a number').isNumeric(),
  check('name', 'Product name must be at most 150 characters').optional().isLength({ max: 150 }),
  check('description', 'Product description must be at most 500 characters').optional().isLength({ max: 500 }),
  check('stock', 'Stock must be a non-negative integer').optional().isInt({ min: 0 }),
  check('idCategory', 'Category ID must be a number').optional().isInt({ min: 1 }),
  validateFields
], updateProduct);

/**
 * @route   DELETE /api/products/delete/:id
 * @desc    Elimina un producto
 * @access  Private/Admin
 */

router.delete("/delete/:id", [
  validateJWT,
  check('id', 'ID must be a number').isNumeric(),
  validateFields
], deleteProduct);

export default router;