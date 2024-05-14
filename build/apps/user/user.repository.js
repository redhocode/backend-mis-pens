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
exports.deleteUser = exports.editUser = exports.findUsersById = exports.findUsers = exports.findUserByusername = void 0;
const db_1 = __importDefault(require("../../db"));
const findUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.default.user.findMany();
    return users;
});
exports.findUsers = findUsers;
const findUsersById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({
        where: {
            id
        }
    });
    return user;
});
exports.findUsersById = findUsersById;
const insertUser = (userData, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.create({
        data: {
            username: userData.username,
            password: userData.password
        }
    });
    return user;
});
const editUser = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.update({
        where: {
            id
        },
        data: {
            username: userData.username,
            password: userData.password
        }
    });
    return user;
});
exports.editUser = editUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.user.delete({
        where: {
            id
        }
    });
});
exports.deleteUser = deleteUser;
const findUserByusername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({
        where: {
            username
        }
    });
    return user;
});
exports.findUserByusername = findUserByusername;
//# sourceMappingURL=user.repository.js.map