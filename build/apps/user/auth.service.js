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
exports.findUserById = exports.editUserById = exports.deleteUserById = exports.getUserById = exports.getAllUsers = exports.findUserByUsername = exports.createUser = void 0;
const db_1 = __importDefault(require("../../db"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.create({
        data: {
            username: userData.username,
            password: userData.password,
            role: userData.role
        }
    });
    return user;
});
exports.createUser = createUser;
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({
        where: {
            username
        }
    });
    return user;
});
exports.findUserByUsername = findUserByUsername;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.default.user.findMany();
        return users;
    }
    catch (error) {
        // Handle error jika terjadi kesalahan saat mengakses database
        console.error('Error while getting all users:', error);
        throw error; // Anda dapat menangani atau melemparkan error sesuai kebutuhan aplikasi
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({
        where: {
            id
        }
    });
    return user;
});
exports.getUserById = getUserById;
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.delete({
        where: {
            id
        }
    });
    return user;
});
exports.deleteUserById = deleteUserById;
const editUserById = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.update({
        where: {
            id
        },
        data: Object.assign({}, userData)
    });
    return user;
});
exports.editUserById = editUserById;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({
        where: {
            id
        }
    });
    return user;
});
exports.findUserById = findUserById;
//# sourceMappingURL=auth.service.js.map