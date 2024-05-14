"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { findUserByUsername } from 'src/apps/user/auth.service'
dotenv_1.default.config();
// Fungsi untuk menandatangani token JWT menggunakan kunci pribadi
const signJwt = (payload, options) => {
    const privateKey = process.env.JWT_PRIVATE;
    return jsonwebtoken_1.default.sign(payload, privateKey, Object.assign(Object.assign({}, (options && options)), { algorithm: 'RS256' }));
};
exports.signJwt = signJwt;
// Fungsi untuk memverifikasi token JWT menggunakan kunci publik
const verifyJwt = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_PUBLIC);
        return {
            valid: true,
            expired: false,
            decoded
        };
    }
    catch (error) {
        return {
            valid: false,
            expired: error.message === 'jwt expired'
        };
    }
};
exports.verifyJwt = verifyJwt;
// Buat refresh token menggunakan kunci pribadi yang sama dengan access token
const createRefreshToken = (payload, expiresIn) => {
    const privateKey = process.env.JWT_PRIVATE;
    return jsonwebtoken_1.default.sign(payload, privateKey, { expiresIn, algorithm: 'RS256' }); // Menggunakan algoritma RSA untuk kunci pribadi
};
exports.createRefreshToken = createRefreshToken;
//# sourceMappingURL=jwt.js.map