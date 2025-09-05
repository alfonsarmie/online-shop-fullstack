"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user-controller");
const db_validator_helper_1 = require("../helpers/db-validator-helper");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.post("/create", [
    (0, express_validator_1.check)('email', 'Email must be valid').isEmail(),
    (0, express_validator_1.check)('email', 'Email is required').notEmpty(),
    (0, express_validator_1.check)('email', 'Email must be at most 200 characters').isLength({ max: 200 }),
    (0, express_validator_1.check)('email').custom(db_validator_helper_1.existsEmail),
    (0, express_validator_1.check)('name', 'Name is required').notEmpty(),
    (0, express_validator_1.check)('name', 'Name must be at most 200 characters').isLength({ max: 200 }),
    (0, express_validator_1.check)('surname', 'Surname is required').notEmpty(),
    (0, express_validator_1.check)('surname', 'Surname must be at most 200 characters').isLength({ max: 200 }),
    (0, express_validator_1.check)('password', 'Password is required and must be at least 6 characters').isLength({ min: 6 }),
    (0, express_validator_1.check)('password', 'Password must be at most 200 characters').isLength({ max: 200 }),
    (0, express_validator_1.check)('password', 'Password must contain at least one uppercase letter and one number')
        .matches(/^(?=.*[A-Z])(?=.*\d).+$/),
    (0, express_validator_1.check)('dni', 'DNI must be a number').optional().isNumeric(),
    (0, express_validator_1.check)('dni', 'DNI must be at most 200 characters').optional().isLength({ max: 200 }),
    (0, express_validator_1.check)('dni').custom(db_validator_helper_1.existsDni),
    //NOTE: Img validations were removed since user wont have profile img
    validate_fields_1.validateFields
], user_controller_1.createUser);
router.delete("/delete/:id", [
    validate_jwt_1.validateJWT,
    (0, express_validator_1.check)('id', 'ID must be a number').isNumeric(),
    (0, express_validator_1.check)('id').custom(db_validator_helper_1.existsUserById),
    validate_fields_1.validateFields
], user_controller_1.deleteUser);
router.put("/update/:id", [
    validate_jwt_1.validateJWT,
    (0, express_validator_1.check)('id', 'ID must be a number').isNumeric(),
    (0, express_validator_1.check)('id').custom(db_validator_helper_1.existsUserById),
    validate_fields_1.validateFields
], user_controller_1.updateUser);
// Custom validator to check if user exists by ID
exports.default = router;
//# sourceMappingURL=user-routes.js.map