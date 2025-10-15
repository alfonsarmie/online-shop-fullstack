import { Router, Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderMpStatus,
  getUserOrders,
  deleteOrder,
  getOrderStatistics
} from '../controllers/order-controller';
import { validateFields } from '../middlewares/validate-fields';
import { validateJWT, allowAdminOrReceptionist, requireAuth } from '../middlewares/validate-jwt';
import Order from '../models/order-model';

const router = Router();

// POST - Create new order (authenticated users)
router.post("/", [
  validateJWT,
  check('idUser', 'User ID is required').notEmpty(),
  check('idPaymentMethod', 'Payment method ID is required').notEmpty,
  check('customer_name', 'Customer name is required').notEmpty(),
  check('customer_email', 'Valid customer email is required').isEmail(),
  check('items', 'Items array is required').isArray({ min: 1 }),
  check('items.*.idProduct', 'Product ID is required for each item').notEmpty,
  check('items.*.quantity', 'Quantity must be a positive integer').isInt({ min: 1 }),
  validateFields
], createOrder);

// GET - Get all orders with pagination and filtering (admin/receptionist only)
router.get("/", [
  allowAdminOrReceptionist
], getOrders);

// GET - Get order statistics (admin only)
router.get("/statistics", [
  validateJWT // Only admin should access this
], getOrderStatistics);

// GET - Get specific order by ID
router.get("/:id", [
  validateJWT,
  check('id', 'Order ID must be a number').isNumeric(),
  validateFields
], getOrderById);

// GET - Get all orders for a specific user
router.get("/user/:userId", [
  requireAuth,
  check('userId', 'User ID must be a number').isNumeric(),
  validateFields
], getUserOrders);

// PATCH - Update order status (admin/receptionist only)
router.patch("/:id/status", [
  allowAdminOrReceptionist,
  check('id', 'Order ID must be a number').isNumeric(),
  check('description', 'Status description is required').notEmpty(),
  validateFields
], updateOrderStatus);

// PATCH - Update MercadoPago status (for webhooks and admin updates)
router.patch("/:id/mp-status", [
  check('id', 'Order ID must be a number').isNumeric(),
  check('statusMp', 'MercadoPago status is required').isIn([
    'pending', 'approved', 'in_process', 'rejected', 'cancelled', 'refunded', 'charged_back'
  ]),
  validateFields
], updateOrderMpStatus);

// DELETE - Delete order (admin only)
router.delete("/:id", [
  validateJWT, // Only admin should delete orders
  check('id', 'Order ID must be a number').isNumeric(),
  validateFields
], deleteOrder);

export default router;