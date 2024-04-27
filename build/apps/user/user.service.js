"use strict";
// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya
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
exports.deleteUserById = exports.editUserById = exports.createUser = exports.getUserById = exports.getAllUsers = exports.createSession = void 0;
const user_repository_1 = require("./user.repository");
const user_validation_1 = require("./user.validation");
const hashing_1 = require("../../utils/hashing");
const jwt_1 = require("../../utils/jwt");
const jwt_2 = require("../../utils/jwt");
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, user_repository_1.findUsers)();
    return users;
});
exports.getAllUsers = getAllUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_repository_1.findUsersById)(id);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
exports.getUserById = getUserById;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, user_validation_1.createUserValidation)(userData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    try {
        // Menggunakan password yang sudah di-hash
        value.password = yield (0, hashing_1.hashPassword)(value.password);
        // Mengembalikan data user yang baru saja dibuat
        return value.password;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.createUser = createUser;
const editUserById = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, user_validation_1.createUserValidation)(userData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const user = yield (0, user_repository_1.editUser)(id, userData);
    return user;
});
exports.editUserById = editUserById;
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield getUserById(id);
    yield (0, user_repository_1.deleteUser)(id);
});
exports.deleteUserById = deleteUserById;
/**
 * @param  {UserData} userData
 * @return {Promise<User>}
 */
const createSession = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, user_validation_1.createSessionValidation)(userData);
    if (error) {
        throw new Error('Invalid input data');
    }
    try {
        // Cari pengguna berdasarkan nama pengguna
        const user = yield (0, user_repository_1.findUserByusername)(value.username);
        if (!user) {
            throw new Error('User not found');
        }
        // Periksa apakah kata sandi cocok
        if (!user.password) {
            throw new Error('User password is null or undefined');
        }
        const isPasswordValid = yield (0, hashing_1.checkPassword)(value.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        // Autentikasi berhasil, kembalikan data pengguna yang diotentikasi
        const accessToken = (0, jwt_1.signJwt)({ userId: user.id });
        // Buat refresh token
        const refreshToken = (0, jwt_2.createRefreshToken)({ userId: user.id }, process.env.JWT_REFRESH_EXPIRATION || '7d');
        // Kembalikan pengguna bersama dengan token
        return Object.assign({}, user);
    }
    catch (error) {
        console.error('Authentication failed:', error);
        throw new Error('Authentication failed: ' + error.message);
    }
});
exports.createSession = createSession;
//# sourceMappingURL=user.service.js.map