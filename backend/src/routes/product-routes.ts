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



router.get('/topfive',[validateJWT,getTopFive]);



router.get('/critical',[validateJWT],getCriticalProducts)


router.get("/", getAllProducts);



router.get("/:id", [
  check('id', 'ID must be a number').isNumeric(),
  validateFields
], getProduct);



router.post("/create", [
  validateJWT,
  check('name', 'Product name is required').notEmpty(),
  check('name', 'Product name must be at most 150 characters').isLength({ max: 150 }),
  check('description', 'Product description must be at most 500 characters').optional().isLength({ max: 500 }),
  check('stock', 'Stock must be a non-negative integer').isInt({ min: 0 }),
  check('idCategory', 'Category ID is required').isInt({ min: 1 }),
  validateFields
], createProduct);



router.put("/update/:id", [
  allowAdminOrReceptionist,
  check('id', 'ID must be a number').isNumeric(),
  check('name', 'Product name must be at most 150 characters').optional().isLength({ max: 150 }),
  check('description', 'Product description must be at most 500 characters').optional().isLength({ max: 500 }),
  check('stock', 'Stock must be a non-negative integer').optional().isInt({ min: 0 }),
  check('idCategory', 'Category ID must be a number').optional().isInt({ min: 1 }),
  validateFields
], updateProduct);



router.delete("/delete/:id", [
  validateJWT,
  check('id', 'ID must be a number').isNumeric(),
  validateFields
], deleteProduct);

export default router;