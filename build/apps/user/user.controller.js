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
const express_1 = __importDefault(require("express"));
const user_service_1 = require("./user.service");
const logger_1 = require("../../utils/logger");
const user_validation_1 = require("./user.validation");
const hashing_1 = require("../../utils/hashing");
const jwt_1 = require("../../utils/jwt");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_service_1.getAllUsers)();
        logger_1.logger.info("Get all users success");
        res.status(200).send(users);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield (0, user_service_1.getUserById)(userId);
        logger_1.logger.info(`Get user with id ${userId} success`);
        res.status(200).send({ status: true, statusCode: 200, data: user });
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUserData = req.body;
        const { error } = (0, user_validation_1.createUserValidation)(newUserData);
        if (error) {
            logger_1.logger.error(`Error validating user data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        // Hash password menggunakan fungsi yang sudah Anda buat
        const hashedPassword = yield (0, hashing_1.hashPassword)(newUserData.password);
        // Buat objek user baru dengan password yang di-hash
        const user = yield (0, user_service_1.createUser)(Object.assign(Object.assign({}, newUserData), { password: hashedPassword }));
        // Autentikasi berhasil, buat token JWT
        const accessToken = (0, jwt_1.signJwt)({ userId: user.id }); // Menggunakan user.id sebagai payload
        const refreshToken = (0, jwt_1.createRefreshToken)({ userId: user.id }, process.env.JWT_REFRESH_EXPIRATION || '7d');
        logger_1.logger.info("User created successfully");
        res.status(200).send({ status: true, statusCode: 200, data: { user, accessToken, refreshToken } });
    }
    catch (error) {
        logger_1.logger.error(`Error creating user: ${error.message}`);
        res.status(422).send({ status: false, statusCode: 422, message: error.message });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        yield (0, user_service_1.deleteUserById)(userId);
        logger_1.logger.info(`Delete user with id ${userId} success`);
        res.status(200).send(`Delete user with id ${userId} success`);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const userData = req.body;
    if (!(userData.name && userData.email && userData.password)) {
        logger_1.logger.error("Some fields are missing");
        return res.status(400).send("Some fields are missing");
    }
    try {
        const user = yield (0, user_service_1.editUserById)(userId, userData);
        logger_1.logger.info(`Edit user with id ${userId} success`);
        res.send({
            data: user,
            message: "edit user success",
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const user = yield (0, user_service_1.editUserById)(userId, userData);
        logger_1.logger.info(`Edit user with id ${userId} success`);
        res.send({
            data: user,
            message: "edit user success",
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        // Panggil fungsi untuk membuat sesi, termasuk pembuatan token
        const user = yield (0, user_service_1.createSession)(userData);
        // Dalam createSession, token JWT sudah dibuat, cukup gunakan token yang sudah ada
        logger_1.logger.info('User authenticated successfully');
        // Kembalikan data pengguna dan token dari hasil pemanggilan createSession
        res.status(200).send({ status: true, statusCode: 200, message: 'Login successful', data: user });
    }
    catch (error) {
        logger_1.logger.error(`Error authenticating user: ${error.message}`);
        res.status(422).send({ status: false, statusCode: 422, message: error.message });
    }
}));
// export default router;
//# sourceMappingURL=user.controller.js.map