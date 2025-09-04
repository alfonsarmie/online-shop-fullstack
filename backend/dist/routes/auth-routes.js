"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth-controller");
const validate_fields_1 = require("../middlewares/validate-fields");
const router = (0, express_1.Router)();
router.post("/login", [
    (0, express_validator_1.check)('email', 'Email must be a valid one').isEmail(),
    (0, express_validator_1.check)('password', 'Password is required').notEmpty(),
    validate_fields_1.validateFields
], auth_controller_1.loginUser);
exports.default = router;
//# sourceMappingURL=auth-routes.js.map