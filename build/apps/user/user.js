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
exports.accessValidation = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../../db"));
const logger_1 = require("../../utils/logger");
const user_validation_1 = require("./user.validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid"); // Import untuk menghasilkan UUID
const jwt_1 = require("../../utils/jwt");
const router = express_1.default.Router();
const accessValidation = (req, res, next) => {
    const validationReq = req;
    const { authorization } = validationReq.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: Access token is missing or invalid'
        });
    }
    const token = authorization.split(' ')[1]; // Mengambil token dari header Authorization
    const jwtVerification = (0, jwt_1.verifyJwt)(token);
    if (!jwtVerification.valid) {
        if (jwtVerification.expired) {
            return res.status(401).json({
                message: 'Unauthorized: Token expired'
            });
        }
        else {
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
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.user.findMany({
            select: {
                id: true,
                username: true,
            }
        });
        logger_1.logger.info("Get all users success");
        res.json({
            data: result,
            message: 'User list'
        });
    }
    catch (error) {
        // Log the error
        logger_1.logger.error(`Error occurred while fetching user list: ${error}`);
        // Respond with an error message
        res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
}));
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Menghasilkan UUID atau nanoid
        const id = (0, uuid_1.v4)(); // Menggunakan UUID
        // const id = nanoid(); // Menggunakan nanoid
        // Validate request body
        const { error } = (0, user_validation_1.createUserValidation)(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { username, password } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const result = yield db_1.default.user.create({
            data: {
                id,
                username,
                password: hashedPassword
            }
        });
        logger_1.logger.info("User created successfully");
        res.json({
            data: result,
            message: 'User created'
        });
    }
    catch (error) {
        // Log the error
        console.error(`Error occurred while creating user: ${error}`);
        // Respond with an error message
        res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
}));
router.patch("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { username } = req.body;
        const result = yield db_1.default.user.update({
            where: { id: userId },
            data: { username: username }
        });
        logger_1.logger.info("User updated successfully");
        res.json({
            data: result,
            message: 'User updated'
        });
    }
    catch (error) {
        console.error(`Error occurred while updating user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { username } = req.body;
        const result = yield db_1.default.user.update({
            where: { id: userId },
            data: { username: username }
        });
        logger_1.logger.info("User updated successfully");
        res.json({
            data: result,
            message: 'User updated'
        });
    }
    catch (error) {
        console.error(`Error occurred while updating user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const result = yield db_1.default.user.delete({
            where: { id: userId }
        });
        logger_1.logger.info("User deleted successfully");
        res.json({
            data: result,
            message: 'User deleted'
        });
    }
    catch (error) {
        console.error(`Error occurred while deleting user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Find user by username
        const user = yield db_1.default.user.findUnique({
            where: {
                username: username,
            }
        });
        // If user is not found, return 404
        if (!user) {
            logger_1.logger.info("User not found");
            return res.status(404).json({
                message: 'User not found'
            });
        }
        // If user's password is not set, return 404
        if (!user.password) {
            logger_1.logger.info("Password not set");
            return res.status(404).json({
                message: 'Password not set'
            });
        }
        // Check if password is valid
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        // If password is valid, return user data
        if (isPasswordValid) {
            const payload = {
                id: user.id,
                username: user.username
            };
            // Sign JWT token
            const accessToken = (0, jwt_1.signJwt)(payload, { expiresIn: '1h' });
            // Log successful authentication
            logger_1.logger.info(`User ${username} authenticated successfully`);
            return res.json({
                data: {
                    id: user.id,
                    name: user.username,
                },
                accessToken: accessToken,
                message: 'User authenticated',
            });
        }
        else {
            // If password is invalid, return 403
            logger_1.logger.info("Wrong password");
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
router.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Here, you might want to invalidate the token.
        // Since JWT tokens are stateless, you might need to manage a blacklist of revoked tokens,
        // or you can rely on token expiration to effectively "logout" the user.
        // Optionally, you can log the user out from all devices by invalidating all tokens associated with the user.
        res.json({ message: 'Logout successful' });
        logger_1.logger.info("User logged out successfully");
    }
    catch (error) {
        logger_1.logger.error(`Error occurred during logout: ${error}`);
        console.error(`Error occurred during logout: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map