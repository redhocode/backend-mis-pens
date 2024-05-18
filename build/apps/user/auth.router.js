"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_contoller_1 = require("./auth.contoller");
const auth_1 = require("../../middleware/auth");
exports.AuthRouter = (0, express_1.Router)();
exports.AuthRouter.post('/register', auth_contoller_1.registerUser);
exports.AuthRouter.post('/login', auth_contoller_1.createSession);
exports.AuthRouter.post('/refresh', auth_contoller_1.refreshToken);
exports.AuthRouter.get('/', auth_1.requireAdmin, auth_contoller_1.getAll);
exports.AuthRouter.patch('/:id', auth_contoller_1.updateUser);
exports.AuthRouter.delete('/:id', auth_contoller_1.deleteUser);
exports.AuthRouter.post('/logout', auth_contoller_1.logout);
//# sourceMappingURL=auth.router.js.map