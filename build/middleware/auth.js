"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessValidation = exports.requiredUserAdministrasi = exports.requireUserAkademic = exports.requireAdmin = exports.requireUser = void 0;
const jwt_1 = require("../utils/jwt");
const requireUser = (req, res, next) => {
    const user = res.locals.user;
    if (!user) {
        return res.status(403).send({ message: 'User information is missing or invalid' });
    }
    next();
};
exports.requireUser = requireUser;
const requireAdmin = (req, res, next) => {
    const user = res.locals.user;
    // Pastikan informasi pengguna ada dan rolenya adalah 'admin'
    if (!user || user.role !== 'Admin') {
        // Jika tidak memenuhi kriteria, kembalikan respons 403 Forbidden
        return res.status(403).send({ message: 'User information is missing or invalid' });
    }
    // Jika memenuhi kriteria, lanjutkan ke middleware atau handler berikutnya
    next();
};
exports.requireAdmin = requireAdmin;
const requireUserAkademic = (req, res, next) => {
    const user = res.locals.user;
    if (!user || user.role !== 'Akademik') {
        return res.status(403).send({ message: 'User information is missing or invalid' });
    }
    next();
};
exports.requireUserAkademic = requireUserAkademic;
const requiredUserAdministrasi = (req, res, next) => {
    const user = res.locals.user;
    if (!user || user.role !== 'Administrasi') {
        return res.status(403).send({ message: 'User information is missing or invalid' });
    }
    next();
};
exports.requiredUserAdministrasi = requiredUserAdministrasi;
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
        // Jika dekoded tidak berupa string, maka berisi data pengguna
        const userData = jwtVerification.decoded;
        // Menetapkan nilai userId dan username ke dalam objek permintaan
        validationReq.userId = userData.userId;
        validationReq.username = userData.username;
    }
    next();
};
exports.accessValidation = accessValidation;
//# sourceMappingURL=auth.js.map