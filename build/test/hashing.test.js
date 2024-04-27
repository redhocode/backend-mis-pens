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
Object.defineProperty(exports, "__esModule", { value: true });
const hashing_1 = require("../utils/hashing"); // Sesuaikan dengan lokasi file hashing.ts
describe('Hashing', () => {
    const plainPassword = 'password123';
    let hashedPassword;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        hashedPassword = yield (0, hashing_1.hashPassword)(plainPassword);
    }));
    it('Hashing password should return a string', () => {
        expect(hashedPassword).toBeDefined();
        expect(typeof hashedPassword).toBe('string');
    });
    it('Validating password should return true for correct password', () => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield (0, hashing_1.checkPassword)(plainPassword, hashedPassword);
        expect(isValid).toBe(true);
    }));
    it('Validating password should return false for incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield (0, hashing_1.checkPassword)('incorrectPassword', hashedPassword);
        expect(isValid).toBe(false);
    }));
});
//# sourceMappingURL=hashing.test.js.map