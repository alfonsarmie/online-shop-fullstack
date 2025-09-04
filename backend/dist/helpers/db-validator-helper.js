"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsUserById = exports.existsDni = exports.existsEmail = void 0;
const user_model_1 = __importDefault(require("../models/user-model"));
// Validate uniqueness of email
const existsEmail = async (email) => {
    const existingUser = await user_model_1.default.findOne({ where: { email } });
    if (existingUser) {
        throw new Error(`Email already exists`);
    }
};
exports.existsEmail = existsEmail;
// Validate uniqueness of DNI
const existsDni = async (dni) => {
    if (dni) {
        const existingDniUser = await user_model_1.default.findOne({ where: { dni } });
        if (existingDniUser) {
            throw new Error(`DNI already exists`);
        }
    }
};
exports.existsDni = existsDni;
const existsUserById = async (id) => {
    const existsUser = await user_model_1.default.findByPk(id);
    if (!existsUser) {
        throw new Error(`User with ID ${id} does not exist`);
    }
};
exports.existsUserById = existsUserById;
//# sourceMappingURL=db-validator-helper.js.map