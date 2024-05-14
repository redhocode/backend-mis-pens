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
exports.authorize = exports.checkAdminRole = exports.accessValidation = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../../db"));
const logger_1 = require("../../utils/logger");
const user_validation_1 = require("./user.validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jwt_1 = require("../../utils/jwt");
const router = express_1.default.Router();
// Middleware untuk pengaturan sesi
const accessValidation = (req, res, next) => {
    const validationReq = req;
    const { authorization } = validationReq.headers;
    console.log('Authorization header:', authorization); // Log Authorization header
    if (!authorization || !authorization.startsWith('Bearer ')) {
        console.log('Missing or invalid access token');
        return res.status(401).json({
            message: 'Unauthorized: Access token is missing or invalid'
        });
    }
    const token = authorization.split(' ')[1]; // Mengambil token dari header Authorization
    console.log('Token:', token); // Log token
    const jwtVerification = (0, jwt_1.verifyJwt)(token);
    console.log('JWT verification:', jwtVerification); // Log JWT verification result
    if (!jwtVerification.valid) {
        if (jwtVerification.expired) {
            console.log('Token expired');
            return res.status(401).json({
                message: 'Unauthorized: Token expired'
            });
        }
        else {
            console.log('Invalid access token');
            return res.status(401).json({
                message: 'Unauthorized: Invalid access token'
            });
        }
    }
    if (typeof jwtVerification.decoded !== 'string') {
        validationReq.userData = jwtVerification.decoded;
    }
    next();
};
exports.accessValidation = accessValidation;
const checkAdminRole = (req, res, next) => {
    const userRole = req.body.role; // Pastikan Anda mengambil peran pengguna dari objek userData yang sesuai dengan token
    if (userRole !== 'admin') {
        console.log('User does not have admin role');
        return res.status(403).json({
            message: 'Forbidden: You do not have permission to access this resource'
        });
    }
    next();
};
exports.checkAdminRole = checkAdminRole;
const authorize = (allowedRoles, userData) => {
    return (req, res, next) => {
        const userRole = req.userData.role; // Ambil peran pengguna dari data pengguna yang disimpan dalam JWT
        // Periksa apakah peran pengguna memiliki izin untuk mengakses sumber daya
        if (typeof userRole === 'string' && allowedRoles.includes(userRole)) {
            // Jika pengguna memiliki izin, lanjutkan ke middleware berikutnya
            next();
        }
        else {
            // Jika pengguna tidak memiliki izin, kirim respons error
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
        }
    };
};
exports.authorize = authorize;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        let result;
        if (search) {
            result = yield db_1.default.user.findMany({
                where: {
                    username: {
                        contains: search.toString()
                    }
                },
                select: {
                    id: true,
                    username: true,
                    role: true
                }
            });
        }
        else {
            result = yield db_1.default.user.findMany({
                select: {
                    id: true,
                    username: true,
                    role: true
                }
            });
        }
        logger_1.logger.info('Get all users success');
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error(`Error occurred while fetching user list: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const { error } = (0, user_validation_1.createUserValidation)(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { username, password, role } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const result = yield db_1.default.user.create({
            data: {
                id,
                username,
                role,
                password: hashedPassword
            }
        });
        logger_1.logger.info('User created successfully');
        res.json(result);
    }
    catch (error) {
        console.error(`Error occurred while creating user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
}));
router.patch('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { username } = req.body;
        const result = yield db_1.default.user.update({
            where: { id: userId },
            data: { username: username }
        });
        logger_1.logger.info('User updated successfully');
        res.json(result);
    }
    catch (error) {
        console.error(`Error occurred while updating user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { username } = req.body;
        const result = yield db_1.default.user.update({
            where: { id: userId },
            data: { username: username }
        });
        logger_1.logger.info('User updated successfully');
        res.json(result);
    }
    catch (error) {
        console.error(`Error occurred while updating user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const result = yield db_1.default.user.delete({
            where: { id: userId }
        });
        logger_1.logger.info('User deleted successfully');
        res.json(result);
    }
    catch (error) {
        console.error(`Error occurred while deleting user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield db_1.default.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user) {
            logger_1.logger.info('User not found');
            return res.status(404).json({
                message: 'User not found'
            });
        }
        if (!user.password) {
            logger_1.logger.info('Password not set');
            return res.status(404).json({
                message: 'Password not set'
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (isPasswordValid) {
            const payload = {
                id: user.id,
                username: user.username,
                role: user.role // Menyertakan peran pengguna dalam payload JWT
            };
            const accessToken = (0, jwt_1.signJwt)(payload, { expiresIn: '7d' });
            res.setHeader('Authorization', `Bearer ${accessToken}`);
            logger_1.logger.info(`User ${username} authenticated successfully`);
            return res.json({
                data: {
                    id: user.id,
                    name: user.username,
                    role: user.role
                },
                accessToken: accessToken,
                message: 'User authenticated'
            });
        }
        else {
            logger_1.logger.info('Wrong password');
            return res.status(403).json({
                message: 'Wrong password'
            });
        }
    }
    catch (error) {
        console.error(`Error occurred while authenticating user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ message: 'Logout successful' });
        logger_1.logger.info('User logged out successfully');
    }
    catch (error) {
        logger_1.logger.error(`Error occurred during logout: ${error}`);
        console.error(`Error occurred during logout: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// export default router
//# sourceMappingURL=user.js.map