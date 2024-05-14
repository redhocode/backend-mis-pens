"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSessionValidation = exports.createSessionValidation = exports.createUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createUserValidation = (playload) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
        role: joi_1.default.string().required()
    });
    return schema.validate(playload);
};
exports.createUserValidation = createUserValidation;
const createSessionValidation = (playload) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
        role: joi_1.default.string().required()
    });
    return schema.validate(playload);
};
exports.createSessionValidation = createSessionValidation;
const refreshSessionValidation = (playload) => {
    const schema = joi_1.default.object({
        refresh_token: joi_1.default.string().required()
    });
    return schema.validate(playload);
};
exports.refreshSessionValidation = refreshSessionValidation;
//# sourceMappingURL=user.validation.js.map