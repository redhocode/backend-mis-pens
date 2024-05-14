"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createProductValidation = (playload) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        image: joi_1.default.string().required(),
        price: joi_1.default.number().required()
    });
    return schema.validate(playload);
};
exports.createProductValidation = createProductValidation;
//# sourceMappingURL=producr.validation.js.map