"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Hash a password
 * @param password The password to hash
 * @returns The hashed password
 */
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        return hashedPassword;
    }
    catch (error) {
        throw new Error("Error hashing password: " + error.message);
    }
});
exports.hashPassword = hashPassword;
/**
 * Check if a password matches the user's password hash
 * @param password The password to compare
 * @param userPassword The hashed user password
 * @returns True if the passwords match, false otherwise
 */
const checkPassword = (password, userPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordMatch = yield bcrypt_1.default.compare(password, userPassword);
        return passwordMatch;
    }
    catch (error) {
        throw new Error("Error comparing passwords: " + error.message);
    }
});
exports.checkPassword = checkPassword;
//# sourceMappingURL=hashing.js.map