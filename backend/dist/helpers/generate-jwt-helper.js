"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'default_secret', {
            expiresIn: '4h' // Token expires in 4 hours
        }, (err, token) => {
            if (err) {
                console.error(err);
                reject('Error generating JWT');
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generateJWT = generateJWT;
//# sourceMappingURL=generate-jwt-helper.js.map