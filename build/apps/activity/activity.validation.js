"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivityValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createActivityValidation = (playload) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        date: joi_1.default.date().required(),
        description: joi_1.default.string().required(),
        image: joi_1.default.binary().optional(),
        link: joi_1.default.string().allow('').optional(),
        userId: joi_1.default.number().optional(),
        imageUrl: joi_1.default.string().optional()
    });
    return schema.validate(playload);
};
exports.createActivityValidation = createActivityValidation;
//# sourceMappingURL=activity.validation.js.map