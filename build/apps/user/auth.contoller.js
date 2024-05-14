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
exports.logout = exports.updateUser = exports.deleteUser = exports.getUser = exports.getAll = exports.refreshToken = exports.createSession = exports.registerUser = void 0;
const auth_validation_1 = require("./auth.validation");
const uuid_1 = require("uuid");
const logger_1 = require("../../utils/logger");
const hashing_1 = require("../../utils/hashing");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("../../utils/jwt");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, uuid_1.v4)();
    const { error, value } = (0, auth_validation_1.createUserValidation)(req.body);
    if (error) {
        logger_1.logger.error(`error validating user data: ${error.details[0].message}`);
        return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
    }
    try {
        // Hashing the password before saving it
        const hashedPassword = yield (0, hashing_1.hashPassword)(value.password, 10); // 10 is the saltRounds
        value.password = hashedPassword;
        yield (0, auth_service_1.createUser)(value);
        return res.status(200).send({ status: true, statusCode: 200, message: 'User created successfully' });
    }
    catch (err) {
        logger_1.logger.error(`Error creating user: ${err.message}`);
        return res.status(422).send({ status: false, statusCode: 422, message: err.message });
    }
});
exports.registerUser = registerUser;
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, auth_validation_1.createSessionValidation)(req.body);
    if (error) {
        logger_1.logger.error(`Error validating user data: ${error.details[0].message}`);
        return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
    }
    try {
        const user = yield (0, auth_service_1.findUserByUsername)(value.username);
        if (user === null) {
            return res.status(401).send({ status: false, statusCode: 401, message: 'User not found' });
        }
        const isValid = yield (0, hashing_1.checkPassword)(value.password, user.password);
        if (!isValid) {
            return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid credentials' });
        }
        const accessToken = (0, jwt_1.signJwt)(Object.assign({}, user), { expiresIn: '1h' });
        const refreshToken = (0, jwt_1.signJwt)(Object.assign({}, user), { expiresIn: '7d' });
        //console.log('Respons login:', { accessToken, refreshToken })
        logger_1.logger.info('Login successful');
        return res
            .status(200)
            .send({ status: true, statusCode: 200, message: 'Login successful', data: { accessToken, refreshToken } });
    }
    catch (error) {
        logger_1.logger.error(`Error finding user: ${error.message}`);
        return res.status(422).send({ status: false, statusCode: 422, message: error.message });
    }
});
exports.createSession = createSession;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, auth_validation_1.refreshSessionValidation)(req.body);
    if (error) {
        logger_1.logger.error(`error validating user data: ${error.details[0].message}`);
        return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
    }
    try {
        const { decoded } = (0, jwt_1.verifyJwt)(value.refreshToken);
        const user = yield (0, auth_service_1.findUserByUsername)(decoded.username);
        if (!user)
            return false;
        const accessToken = (0, jwt_1.signJwt)(Object.assign({}, user), { expiresIn: '1d' });
        return res.status(200).send({ status: true, statusCode: 200, message: 'Refresh successful', data: { accessToken } });
    }
    catch (error) {
        logger_1.logger.error(`Error finding user: ${error.message}`);
        return res.status(422).send({ status: false, statusCode: 422, message: error.message });
    }
});
exports.refreshToken = refreshToken;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, auth_service_1.getAllUsers)();
        logger_1.logger.info('Get all users success');
        res.status(200).send(users);
    }
    catch (error) {
        logger_1.logger.error(`Error finding users: ${error.message}`);
        return res.status(422).send({ status: false, statusCode: 422, message: error.message });
    }
});
exports.getAll = getAll;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.findUserByUsername)(req.params.username);
        return res.status(200).send({ status: true, statusCode: 200, data: user });
    }
    catch (error) {
        logger_1.logger.error(`Error finding user: ${error.message}`);
        return res.status(422).send({ status: false, statusCode: 422, message: error.message });
    }
});
exports.getUser = getUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield (0, auth_service_1.findUserById)(userId);
        if (!user) {
            return res.status(404).send({ status: false, statusCode: 404, message: 'User not found' });
        }
        yield (0, auth_service_1.deleteUserById)(userId);
        return res.status(200).send({ status: true, statusCode: 200, message: 'User deleted successfully' });
    }
    catch (error) {
        logger_1.logger.error(`Error deleting user: ${error.message}`);
        return res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield (0, auth_service_1.findUserById)(userId);
        if (!user) {
            return res.status(404).send({ status: false, statusCode: 404, message: 'User not found' });
        }
        const updatedUser = yield (0, auth_service_1.editUserById)(userId, req.body);
        return res.status(200).send({ status: true, statusCode: 200, data: updatedUser });
    }
    catch (error) {
        logger_1.logger.error(`Error updating user: ${error.message}`);
        return res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' });
    }
});
exports.updateUser = updateUser;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Menghapus access token dari sisi klien (misalnya, cookie atau local storage)
        res.clearCookie('access_token'); // Contoh jika menggunakan cookie
        // Jika access token disimpan dalam database, hapus token tersebut dari database
        // Misalnya, jika Anda memasukkan token ke dalam daftar token yang valid, Anda dapat menghapusnya dari daftar.
        // Namun, perhatikan bahwa pendekatan ini tidak menangani token yang sudah kadaluwarsa.
        logger_1.logger.info('Logout successful');
        return res.status(200).send({ status: true, statusCode: 200, message: 'Logout successful' });
    }
    catch (error) {
        logger_1.logger.error(`Error during logout: ${error.message}`);
        return res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' });
    }
});
exports.logout = logout;
//# sourceMappingURL=auth.contoller.js.map