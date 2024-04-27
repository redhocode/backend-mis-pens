"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
const deserializedToken = (req, res, next) => {
    var _a;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace(/^Bearer\s/, '');
    if (!accessToken) {
        return next();
    }
    const token = (0, jwt_1.verifyJwt)(accessToken);
    if (token.decoded) {
        res.locals.user = token.decoded;
    }
    next();
};
exports.default = deserializedToken;
//# sourceMappingURL=deseliarizedToken.js.map